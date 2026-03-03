#!/usr/bin/env python3
"""
Parse elle's channel dump and extract individual source posts.
For each source: extract title, URL, elle's commentary, then attempt to fetch article content.
"""

import re
import os
import sys
import time
import html
import urllib.request
import urllib.error
import ssl
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

DUMP_FILE = '_context/raw/elle/channel-dump.txt'
OUTPUT_DIR = '_context/raw/elle'

# SSL context that doesn't verify (some academic sites have cert issues)
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE


def slugify(text, max_len=60):
    """Convert text to a filename-safe slug."""
    text = text.lower()
    text = re.sub(r'["\']', '', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    if len(text) > max_len:
        text = text[:max_len].rsplit('-', 1)[0]
    return text


def extract_text_from_html(html_content):
    """Extract readable text from HTML."""
    # Remove script and style tags
    text = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
    text = re.sub(r'<nav[^>]*>.*?</nav>', '', text, flags=re.DOTALL)
    text = re.sub(r'<header[^>]*>.*?</header>', '', text, flags=re.DOTALL)
    text = re.sub(r'<footer[^>]*>.*?</footer>', '', text, flags=re.DOTALL)

    # Try to find article/main content
    article_match = re.search(r'<article[^>]*>(.*?)</article>', text, re.DOTALL)
    if article_match:
        text = article_match.group(1)
    else:
        main_match = re.search(r'<main[^>]*>(.*?)</main>', text, re.DOTALL)
        if main_match:
            text = main_match.group(1)
        else:
            # Try entry-content or post-content
            content_match = re.search(r'class="(?:entry|post|article|page)-content[^"]*"[^>]*>(.*?)</div>', text, re.DOTALL)
            if content_match:
                text = content_match.group(1)

    # Convert tags to text
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>', '\n\n', text)
    text = re.sub(r'<h[1-6][^>]*>', '\n\n', text)
    text = re.sub(r'</h[1-6]>', '\n', text)
    text = re.sub(r'<li[^>]*>', '- ', text)
    text = re.sub(r'</li>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()

    # If too short, probably failed to extract
    if len(text) < 200:
        return None
    return text


def fetch_url(url, timeout=15):
    """Attempt to fetch and extract text from a URL."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout, context=ssl_ctx) as resp:
            content_type = resp.headers.get('Content-Type', '')
            if 'pdf' in content_type.lower():
                return None  # Can't extract PDF
            raw = resp.read()
            # Try utf-8, then latin-1
            try:
                html_content = raw.decode('utf-8')
            except UnicodeDecodeError:
                html_content = raw.decode('latin-1')

            # Check for Cloudflare/bot protection
            if 'Just a moment' in html_content[:1000] or 'challenge-platform' in html_content[:2000]:
                return None
            if 'Access Denied' in html_content[:500]:
                return None

            return extract_text_from_html(html_content)
    except Exception as e:
        return None


def parse_sources(lines):
    """Parse all sources from the channel dump."""
    sources = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        # Match "Source N:" or "Source:" patterns
        m = re.match(r'^Source\s*(\d*):?\s*(.*)', line)
        if not m:
            i += 1
            continue

        source_num = m.group(1)
        title_part = m.group(2).strip()

        # Clean up title
        title = title_part
        # Remove leading punctuation/dashes
        title = re.sub(r'^[—–-]+\s*', '', title)
        # Extract quoted title if present
        quoted = re.search(r'"([^"]+)"', title)
        if quoted:
            clean_title = quoted.group(1)
        else:
            clean_title = title

        # Collect the full source block (until next Source or ───)
        block_lines = [lines[i].strip()]
        url = None
        commentary_lines = []
        j = i + 1

        while j < len(lines) and j < i + 30:
            jline = lines[j].strip()

            # Stop at next source or major separator
            if re.match(r'^Source\s+\d+:', jline) or jline.startswith(':date:'):
                break
            if jline == '───' and j > i + 2:
                break

            block_lines.append(jline)

            # Find URL
            if not url:
                url_match = re.search(r'(https?://[^\s\[\]<>")\]]+)', jline)
                if url_match:
                    candidate = url_match.group(1).rstrip('.,;:)')
                    # Skip link preview URLs
                    if not any(skip in candidate for skip in ['gravatar', 'wp-content', 'emoji']):
                        url = candidate

            # Find commentary
            if jline.startswith(('Harvard relevance:', 'Why it matters:')):
                # Collect multi-line commentary
                commentary_lines.append(jline)
                k = j + 1
                while k < len(lines) and lines[k].strip() and not lines[k].strip().startswith(('───', 'Source', ':date:', ':link:', ':mag:')):
                    commentary_lines.append(lines[k].strip())
                    k += 1

            j += 1

        # Build the full commentary/description from the block
        desc_lines = []
        for bl in block_lines[1:]:  # Skip the Source line itself
            if bl.startswith(('URL:', ':link:', 'https://', 'http://')):
                continue
            if bl.startswith(('Harvard relevance:', 'Why it matters:')):
                continue
            if bl == '───' or bl == '':
                continue
            if bl.startswith(':') and ':' in bl[1:10]:
                continue  # Skip emoji-prefixed metadata
            desc_lines.append(bl)

        commentary = '\n'.join(commentary_lines) if commentary_lines else ''
        description = '\n'.join(desc_lines)

        sources.append({
            'line': i + 1,
            'title': clean_title,
            'raw_title': title_part,
            'url': url,
            'commentary': commentary,
            'description': description,
        })

        i = j

    return sources


def dedupe_sources(sources):
    """Deduplicate sources by URL, keeping the first (most detailed) entry."""
    seen_urls = set()
    seen_titles = set()
    unique = []

    for s in sources:
        url = s.get('url', '')
        title_key = slugify(s['title'])[:30]

        if url and url in seen_urls:
            continue
        if not url and title_key in seen_titles:
            continue

        if url:
            seen_urls.add(url)
        seen_titles.add(title_key)
        unique.append(s)

    return unique


def create_file(source, fetched_text, output_dir):
    """Create the output file for a source."""
    title = source['title']
    slug = slugify(title)

    if not slug or len(slug) < 3:
        slug = slugify(source['raw_title'])

    if fetched_text:
        filename = f"elle-{slug}.txt"
    else:
        filename = f"_COPY-elle-{slug}.txt"

    filepath = os.path.join(output_dir, filename)

    # Avoid overwriting
    if os.path.exists(filepath):
        filepath = filepath.replace('.txt', '-2.txt')

    # Build file content
    parts = []
    parts.append(source['title'])
    if source.get('url'):
        parts.append(source['url'])
    parts.append('')

    # Elle's commentary
    if source.get('description'):
        parts.append("Elle's notes:")
        parts.append(source['description'])
        parts.append('')
    if source.get('commentary'):
        parts.append(source['commentary'])
        parts.append('')

    parts.append('--')
    parts.append('')

    if fetched_text:
        parts.append(fetched_text)
    else:
        parts.append('[Article content not automatically extracted — needs manual copy]')

    with open(filepath, 'w') as f:
        f.write('\n'.join(parts))

    return filepath, filename


def main():
    with open(DUMP_FILE, 'r') as f:
        lines = f.readlines()

    print(f"Loaded {len(lines)} lines from channel dump")

    # Parse sources
    sources = parse_sources(lines)
    print(f"Found {len(sources)} source mentions")

    # Deduplicate
    sources = dedupe_sources(sources)
    print(f"After deduplication: {len(sources)} unique sources")

    # Skip Wikipedia (too generic)
    sources = [s for s in sources if not (s.get('url') or '').startswith('https://en.wikipedia.org')]
    print(f"After filtering Wikipedia: {len(sources)} sources")

    # Process in batches - try to fetch each URL
    results = {'fetched': 0, 'copy': 0, 'errors': []}

    # First pass: fetch all URLs in parallel
    print("\nFetching article content...")
    fetch_results = {}

    urls_to_fetch = [(i, s['url']) for i, s in enumerate(sources) if s.get('url')]

    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_idx = {}
        for idx, url in urls_to_fetch:
            future = executor.submit(fetch_url, url)
            future_to_idx[future] = (idx, url)

        for future in as_completed(future_to_idx):
            idx, url = future_to_idx[future]
            try:
                text = future.result()
                fetch_results[idx] = text
            except Exception as e:
                fetch_results[idx] = None

    print(f"Fetched {sum(1 for v in fetch_results.values() if v)} of {len(urls_to_fetch)} URLs successfully")

    # Second pass: create files
    print("\nCreating files...")
    created_files = []

    for i, source in enumerate(sources):
        fetched_text = fetch_results.get(i)
        filepath, filename = create_file(source, fetched_text, OUTPUT_DIR)
        created_files.append(filename)

        if fetched_text:
            results['fetched'] += 1
        else:
            results['copy'] += 1

    # Summary
    print(f"\n{'='*60}")
    print(f"DONE!")
    print(f"  Total files created: {len(created_files)}")
    print(f"  Content extracted: {results['fetched']}")
    print(f"  Needs manual copy (_COPY-): {results['copy']}")
    print(f"{'='*60}")

    # Write manifest
    manifest_path = os.path.join(OUTPUT_DIR, '_manifest.json')
    manifest = []
    for i, source in enumerate(sources):
        manifest.append({
            'title': source['title'],
            'url': source.get('url', ''),
            'file': created_files[i],
            'has_content': fetch_results.get(i) is not None,
            'line_in_dump': source['line'],
        })
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"\nManifest written to {manifest_path}")


if __name__ == '__main__':
    main()
