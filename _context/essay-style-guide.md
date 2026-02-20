# Essay Page Style Guide

Instructions for building a long-form essay page in Next.js (App Router) with:
- Newsreader serif font from Google Fonts
- Dark/light mode toggle with localStorage persistence
- Sticky sidebar table of contents auto-generated from `##` headings
- "Copy Markdown" button in the navbar
- Mobile-responsive hamburger menu for TOC
- Print-friendly styles
- Markdown rendering via `react-markdown`

---

## Dependencies

```bash
pnpm add react-markdown remark-gfm
```

The project also uses Tailwind CSS (v4 with `@tailwindcss/postcss`), but the essay styles are plain CSS — Tailwind is only imported for its reset/base.

---

## Architecture Overview

There are four files:

| File | Role |
|---|---|
| `app/layout.tsx` | Root layout. Loads Newsreader font, sets metadata/OG tags, injects dark mode script to prevent flash |
| `app/globals.css` | All styling — color scheme, header, toggle, sidebar, essay typography, mobile, print |
| `app/page.tsx` | Server component. Reads the `.md` file with `fs.readFileSync` and passes the raw string to the client component |
| `app/essay-client.tsx` | Client component. Parses markdown, renders header/sidebar/toggle/essay, handles dark mode + copy |

The key pattern: **server component reads the file, client component handles interactivity**. No API route needed.

---

## File 1: `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Your Name",
  description: "Your description",
  openGraph: {
    title: "Essay Title",
    description: "Essay description.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Essay Title",
    description: "Essay description.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('color-mode');
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={newsreader.variable}>
        {children}
      </body>
    </html>
  );
}
```

### Key details

- **Font**: `Newsreader` from `next/font/google`, loaded as a CSS variable `--font-newsreader`. Weights 400 (body) and 600 (headings), both normal and italic styles.
- **Dark mode flash prevention**: An inline `<script>` runs before paint, reads `localStorage('color-mode')`, and adds the `dark` class to `<html>` immediately. This prevents a flash of light mode on reload when dark mode is saved. `suppressHydrationWarning` on `<html>` prevents React hydration mismatch.
- **OG image**: Place a 1200x630 screenshot in `public/`. Reference it as `/og-image.png` in metadata.

---

## File 2: `app/globals.css`

```css
@import "tailwindcss";

:root {
  --bg: rgb(240, 238, 230);
  --fg: rgb(31, 30, 29);
  --toggle-bg: rgba(31, 30, 29, 0.2);
  --toggle-knob: rgb(31, 30, 29);
}

html.dark {
  --bg: rgb(31, 30, 29);
  --fg: rgb(240, 238, 230);
  --toggle-bg: rgba(240, 238, 230, 0.3);
  --toggle-knob: rgb(240, 238, 230);
}

* {
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-newsreader), "Times New Roman", serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ============================================
   HEADER
   ============================================ */

.site-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 32px;
  position: relative;
  border-bottom: 1px solid rgba(128, 128, 128, 0.15);
}

.site-header .author-name {
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

/* ============================================
   HEADER CONTROLS (right side)
   ============================================ */

.header-controls {
  position: absolute;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.copy-btn {
  background: none;
  border: 1px solid var(--fg);
  color: var(--fg);
  font-family: var(--font-newsreader), "Times New Roman", serif;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.copy-btn:hover {
  opacity: 1;
}

/* ============================================
   DARK/LIGHT TOGGLE
   ============================================ */

/* The toggle is a hidden checkbox + styled label.
   The label is a 40x20 pill with a 16px circle knob.
   Checking the checkbox slides the knob right via translateX. */

.toggle-wrapper {
  display: flex;
  align-items: center;
}

.toggle-checkbox {
  display: none;
}

.toggle-label {
  display: block;
  width: 40px;
  height: 20px;
  background: var(--toggle-bg);
  border-radius: 32px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-label::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: var(--toggle-knob);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-checkbox:checked + .toggle-label::after {
  transform: translateX(20px);
}

/* ============================================
   TWO-COLUMN LAYOUT
   ============================================ */

.essay-layout {
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px;
  gap: 64px;
}

/* ============================================
   SIDEBAR TABLE OF CONTENTS
   ============================================ */

/* Sticky sidebar, scrollable if taller than viewport.
   The TOC is auto-generated from ## headings in the markdown. */

.toc-sidebar {
  width: 180px;
  flex-shrink: 0;
  position: sticky;
  top: 48px;
  align-self: flex-start;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.toc-sidebar h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.toc-sidebar ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-sidebar li {
  margin-bottom: 10px;
}

.toc-sidebar a {
  font-size: 20px;
  color: var(--fg);
  text-decoration: none;
  opacity: 0.7;
  line-height: 1.4;
  display: block;
  transition: opacity 0.2s ease;
}

.toc-sidebar a:hover {
  opacity: 1;
}

/* ============================================
   HAMBURGER (mobile only, hidden on desktop)
   ============================================ */

.hamburger-btn {
  display: none;
  background: none;
  border: none;
  color: var(--fg);
  font-size: 22px;
  cursor: pointer;
  padding: 4px 8px;
  opacity: 0.6;
}

.hamburger-btn:hover {
  opacity: 1;
}

/* ============================================
   ESSAY CONTENT / TYPOGRAPHY
   ============================================ */

.essay-content {
  flex: 1;
  max-width: 680px;
}

.essay-content h1 {
  font-size: 62px;
  font-weight: 600;
  line-height: 1.1;
  margin: 0 0 12px 0;
}

.essay-content .subtitle {
  font-size: 20px;
  font-style: italic;
  margin: 0 0 12px 0;
  opacity: 0.8;
}

.essay-content .date {
  font-size: 16px;
  margin: 0 0 32px 0;
  opacity: 0.6;
}

.essay-content h2 {
  font-size: 40px;
  font-weight: 600;
  margin: 48px 0 16px 0;
  line-height: 1.3;
}

.essay-content h3 {
  font-size: 28px;
  font-weight: 600;
  margin: 36px 0 12px 0;
  line-height: 1.3;
}

.essay-content h4 {
  font-size: 24px;
  font-weight: 600;
  margin: 32px 0 12px 0;
  line-height: 1.3;
  font-style: italic;
}

.essay-content p {
  margin: 0 0 20px 0;
}

.essay-content em {
  font-style: italic;
}

.essay-content strong {
  font-weight: 600;
}

.essay-content ul,
.essay-content ol {
  margin: 0 0 20px 0;
  padding-left: 24px;
}

.essay-content li {
  margin-bottom: 8px;
}

.essay-content blockquote {
  border-left: 3px solid var(--fg);
  margin: 24px 0;
  padding: 0 0 0 20px;
  opacity: 0.85;
}

.essay-content a {
  color: var(--fg);
  text-decoration: underline;
}

.essay-content hr {
  border: none;
  border-top: 1px solid rgba(128, 128, 128, 0.3);
  margin: 40px 0;
}

/* ============================================
   MOBILE (< 860px)
   ============================================ */

@media (max-width: 860px) {
  /* Show hamburger, positioned absolute left in the header */
  .hamburger-btn {
    display: block;
    position: absolute;
    left: 32px;
  }

  /* Sidebar becomes a fixed slide-out panel */
  .toc-sidebar {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: var(--bg);
    z-index: 100;
    padding: 64px 24px 24px;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  }

  .toc-sidebar.open {
    display: block;
  }

  /* Dark overlay behind sidebar when open */
  .toc-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }

  .toc-overlay.open {
    display: block;
  }

  .essay-layout {
    padding: 32px 20px;
    gap: 0;
  }

  .essay-content {
    max-width: 100%;
  }

  .essay-content h1 {
    font-size: 36px;
  }
}

/* ============================================
   PRINT
   ============================================ */

@media print {
  .site-header,
  .toc-sidebar,
  .toc-overlay {
    display: none !important;
  }

  .essay-layout {
    padding: 0;
  }

  .essay-content {
    max-width: 100%;
  }
}
```

### Color scheme

| Mode | Background | Text |
|---|---|---|
| Light (default) | `rgb(240, 238, 230)` — warm beige | `rgb(31, 30, 29)` — near black |
| Dark | `rgb(31, 30, 29)` — dark charcoal | `rgb(240, 238, 230)` — warm cream |

Dark mode is toggled by adding/removing the `dark` class on `<html>`. CSS variables swap automatically.

### Typography scale

| Element | Size | Weight | Notes |
|---|---|---|---|
| Body | 20px | 400 | line-height 1.6 |
| Author name (header) | 20px | 400 | letter-spacing 0.02em |
| h1 (essay title) | 62px | 600 | line-height 1.1, 36px on mobile |
| h2 (section headings) | 40px | 600 | |
| h3 | 28px | 600 | |
| h4 (sub-questions) | 24px | 600 | italic |
| Subtitle | 20px | 400 | italic, opacity 0.8 |
| Date | 16px | 400 | opacity 0.6 |
| TOC "Contents" label | 18px | 600 | |
| TOC links | 20px | 400 | opacity 0.7, 1.0 on hover |
| Copy button | 13px | 400 | opacity 0.5, 1.0 on hover |

---

## File 3: `app/page.tsx` (Server Component)

```tsx
import fs from "fs";
import path from "path";
import EssayClient from "./essay-client";

export default function Home() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "puzzles-and-questions.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <EssayClient markdown={markdown} />;
}
```

This is a **server component** (no `"use client"` directive). It reads the markdown file at build time using Node's `fs` module and passes the raw string as a prop to the client component. No API route needed.

To adapt this for a different app, just change the file path. The markdown file should follow this structure:

```markdown
# Essay Title

Subtitle or description line.

Body text begins here...

## Section One

Content...

#### Sub-question heading

More content...

## Section Two

Content...
```

The parser expects:
- Line 1: `# Title` (becomes the large h1)
- First non-empty, non-heading line after the title: subtitle (rendered in italic)
- `## Headings` become TOC entries and section anchors
- `#### Headings` are sub-questions (rendered italic at 24px)

---

## File 4: `app/essay-client.tsx` (Client Component)

```tsx
"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TocItem {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      const text = match[1];
      items.push({ id: slugify(text), text });
    }
  }
  return items;
}

function extractParts(markdown: string): {
  title: string;
  subtitle: string;
  body: string;
} {
  const lines = markdown.split("\n");
  let title = "";
  let subtitle = "";
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const h1Match = lines[i].match(/^# (.+)$/);
    if (h1Match) {
      title = h1Match[1];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() !== "") {
          if (!lines[j].startsWith("#")) {
            subtitle = lines[j].trim();
            bodyStart = j + 1;
          } else {
            bodyStart = j;
          }
          break;
        }
      }
      break;
    }
  }

  // Skip blank lines after subtitle
  for (let i = bodyStart; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      bodyStart = i;
      break;
    }
  }

  return { title, subtitle, body: lines.slice(bodyStart).join("\n") };
}

export default function EssayClient({ markdown }: { markdown: string }) {
  const [isDark, setIsDark] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-mode", "light");
    }
  };

  const { title, subtitle, body } = extractParts(markdown);
  const toc = extractToc(markdown);

  return (
    <>
      <header className="site-header">
        <button
          className="hamburger-btn"
          onClick={() => setTocOpen(!tocOpen)}
          aria-label="Toggle contents"
        >
          &#9776;
        </button>
        <span className="author-name">Marlon Kuzmick</span>
        <div className="header-controls">
          <button
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(markdown).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            aria-label="Copy markdown"
          >
            {copied ? "Copied" : "Copy MD"}
          </button>
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="color-mode"
              className="toggle-checkbox"
              checked={isDark}
              onChange={toggleDark}
            />
            <label htmlFor="color-mode" className="toggle-label" />
          </div>
        </div>
      </header>

      <div
        className={`toc-overlay${tocOpen ? " open" : ""}`}
        onClick={() => setTocOpen(false)}
      />

      <div className="essay-layout">
        <nav className={`toc-sidebar${tocOpen ? " open" : ""}`}>
          <h2>Contents</h2>
          <ol>
            {toc.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setTocOpen(false)}>
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="essay-content">
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
          <p className="date">January 2026</p>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null,
              h2: ({ children }) => {
                const text = String(children);
                const id = slugify(text);
                return <h2 id={id}>{children}</h2>;
              },
            }}
          >
            {body}
          </ReactMarkdown>
        </article>
      </div>
    </>
  );
}
```

### How the client component works

**Markdown parsing** (no external parser needed):
- `extractParts()` pulls the `# Title`, subtitle (first non-heading line after title), and body (everything else)
- `extractToc()` scans for `## ` lines and builds an array of `{ id, text }` for the sidebar
- `slugify()` converts heading text to URL-safe anchor IDs

**Dark mode**:
- On mount, reads the current `dark` class from `<html>` (which was set by the inline script in layout.tsx)
- Toggle adds/removes the `dark` class and persists to `localStorage`
- CSS variables swap automatically via the `html.dark` selector

**Copy markdown**:
- Uses `navigator.clipboard.writeText(markdown)` to copy the raw markdown source
- Shows "Copied" for 2 seconds, then reverts to "Copy MD"

**TOC sidebar**:
- On desktop: sticky sidebar with anchor links to each `## ` section
- On mobile (< 860px): hidden by default, toggled via hamburger button as a fixed slide-out panel with a dark overlay behind it

**ReactMarkdown custom components**:
- `h1` returns `null` (already rendered separately as the large title)
- `h2` adds an `id` attribute matching the slugified text, so TOC anchor links work

---

## How to adapt for another app

1. Install `react-markdown` and `remark-gfm`
2. Copy all four files, adjusting:
   - Author name in `essay-client.tsx`
   - File path in `page.tsx`
   - Metadata/OG tags in `layout.tsx`
   - Date string in `essay-client.tsx`
3. Place your markdown file in the expected location
4. If not using Tailwind, remove the `@import "tailwindcss"` line from `globals.css` — all essay styles are plain CSS
5. If integrating into an existing layout, you can extract just the `EssayClient` component and the CSS — the component only needs a `markdown` string prop
