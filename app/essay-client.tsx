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

export default function EssayClient({ markdown, date }: { markdown: string; date?: string }) {
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
          {date && <p className="date">{date}</p>}

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
