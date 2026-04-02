#!/usr/bin/env python3
"""
Retry fetching _COPY- files with more aggressive strategies.
"""

import os
import re
import html
import json
import time
import urllib.request
import urllib.error
import ssl
from concurrent.futures import ThreadPoolExecutor, as_completed

ELLE_DIR = '_context/raw/elle'

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

HEADERS_CHROME = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'identity',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
}

HEADERS_GOOGLEBOT = {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.5',
}

HEADERS_CURL = {
    'User-Agent': 'curl/8.4.0',
    'Accept': '*/*',
}


def extract_text_from_html(html_content):
    """Extract readable text from HTML - improved version."""
    # Remove script, style, nav, header, footer, aside
    text = html_content
    for tag in ['script', 'style', 'nav', 'header', 'footer', 'aside', 'noscript']:
        text = re.sub(rf'<{tag}[^>]*>.*?</{tag}>', '', text, flags=re.DOTALL | re.IGNORECASE)

    # Try to isolate main content
    for pattern in [
        r'<article[^>]*>(.*?)</article>',
        r'<div[^>]*class="[^"]*(?:entry|post|article|page|main|content|body)[^"]*"[^>]*>(.*?)</div>',
        r'<main[^>]*>(.*?)</main>',
        r'<div[^>]*role="main"[^>]*>(.*?)</div>',
        r'<div[^>]*id="(?:content|main|article|post)"[^>]*>(.*?)</div>',
    ]:
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match and len(match.group(1)) > 500:
            text = match.group(1)
            break

    # Convert tags
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<p[^>]*>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'<h([1-6])[^>]*>(.*?)</h\1>', r'\n\n\2\n', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<li[^>]*>', '- ', text, flags=re.IGNORECASE)
    text = re.sub(r'</li>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<blockquote[^>]*>', '\n> ', text, flags=re.IGNORECASE)
    text = re.sub(r'</blockquote>', '\n', text, flags=re.IGNORECASE)

    # Remove remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)

    # Clean whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n[ \t]+', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()

    return text


def is_good_content(text):
    """Check if extracted text is actually article content."""
    if not text or len(text) < 300:
        return False

    # Check for JS/junk
    junk_indicators = [
        'window.dataLayer', 'gtag(', 'function()', 'createElement',
        'getElementById', 'addEventListener', 'document.write',
        'var ', 'const ', 'let ', '= function', '.push(',
        'cookie', 'localStorage', 'sessionStorage', 'XMLHttpRequest',
        'Just a moment', 'challenge-platform', 'Access Denied',
        'Please enable JavaScript', 'enable cookies',
        'captcha', 'CAPTCHA',
    ]
    first_500 = text[:500]
    junk_count = sum(1 for ind in junk_indicators if ind in first_500)
    if junk_count >= 2:
        return False

    # Check if it's mostly navigation/menu items
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    short_lines = sum(1 for l in lines if len(l) < 30)
    if len(lines) > 10 and short_lines / len(lines) > 0.7:
        return False

    return True


def fetch_with_headers(url, headers, timeout=20):
    """Fetch URL with specific headers."""
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout, context=ssl_ctx) as resp:
            ct = resp.headers.get('Content-Type', '')
            if 'pdf' in ct.lower():
                return None
            raw = resp.read()
            try:
                return raw.decode('utf-8')
            except:
                return raw.decode('latin-1')
    except:
        return None


def try_google_cache(url):
    """Try Google's cached version."""
    cache_url = f"https://webcache.googleusercontent.com/search?q=cache:{url}"
    return fetch_with_headers(cache_url, HEADERS_CHROME, timeout=15)


def try_archive_org(url):
    """Try archive.org's latest snapshot."""
    api_url = f"https://archive.org/wayback/available?url={url}"
    try:
        req = urllib.request.Request(api_url, headers=HEADERS_CURL)
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            data = json.loads(resp.read())
            snapshots = data.get('archived_snapshots', {})
            closest = snapshots.get('closest', {})
            if closest.get('available'):
                archive_url = closest['url']
                return fetch_with_headers(archive_url, HEADERS_CHROME, timeout=20)
    except:
        pass
    return None


def fetch_article(url):
    """Try multiple strategies to fetch article content."""
    strategies = [
        ("Chrome headers", lambda: fetch_with_headers(url, HEADERS_CHROME)),
        ("Googlebot", lambda: fetch_with_headers(url, HEADERS_GOOGLEBOT)),
        ("Curl UA", lambda: fetch_with_headers(url, HEADERS_CURL)),
        ("Google Cache", lambda: try_google_cache(url)),
        ("Archive.org", lambda: try_archive_org(url)),
    ]

    for name, fetcher in strategies:
        try:
            html_content = fetcher()
            if html_content:
                text = extract_text_from_html(html_content)
                if is_good_content(text):
                    return text, name
        except:
            continue

    return None, None


def main():
    copy_files = sorted([f for f in os.listdir(ELLE_DIR) if f.startswith('_COPY-') and f.endswith('.txt')])
    print(f"Found {len(copy_files)} _COPY files to retry")

    # Parse URLs from files
    tasks = []
    for fname in copy_files:
        fpath = os.path.join(ELLE_DIR, fname)
        with open(fpath, 'r') as f:
            content = f.read()

        url = None
        for line in content.split('\n')[:5]:
            m = re.search(r'(https?://[^\s]+)', line)
            if m:
                url = m.group(1).rstrip('.,;:)')
                break

        if url:
            tasks.append((fname, fpath, url, content))
        else:
            print(f"  SKIP (no URL): {fname}")

    print(f"Attempting to fetch {len(tasks)} URLs...\n")

    # Process with thread pool (limited concurrency to avoid rate limits)
    results = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        future_map = {}
        for fname, fpath, url, content in tasks:
            future = executor.submit(fetch_article, url)
            future_map[future] = (fname, fpath, url, content)

        for future in as_completed(future_map):
            fname, fpath, url, content = future_map[future]
            try:
                text, method = future.result()
                results[fname] = (text, method)
                if text:
                    print(f"  OK [{method}]: {fname[:60]}")
                else:
                    print(f"  FAIL: {fname[:60]}")
            except Exception as e:
                results[fname] = (None, None)
                print(f"  ERROR: {fname[:60]} - {e}")

    # Update files that succeeded
    converted = 0
    for fname, fpath, url, original_content in tasks:
        text, method = results.get(fname, (None, None))
        if not text:
            continue

        # Extract header from original _COPY file
        parts = original_content.split('\n--\n', 1)
        header = parts[0] if parts else original_content

        new_content = header + '\n--\n\n' + text + '\n'

        # New filename without _COPY prefix
        new_fname = fname.replace('_COPY-', '', 1)
        new_fpath = os.path.join(ELLE_DIR, new_fname)

        # Avoid overwriting existing files
        if os.path.exists(new_fpath):
            new_fpath = new_fpath.replace('.txt', '-v2.txt')
            new_fname = new_fname.replace('.txt', '-v2.txt')

        with open(new_fpath, 'w') as f:
            f.write(new_content)

        # Remove old _COPY file
        os.remove(fpath)
        converted += 1

    remaining = len(copy_files) - converted
    print(f"\n{'='*60}")
    print(f"RESULTS:")
    print(f"  Successfully fetched & converted: {converted}")
    print(f"  Still needs manual copy: {remaining}")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
