"use client";

import { useState } from "react";
import Link from "next/link";
import ForkingTreeStepper from "./forking-tree-stepper";

export default function ExperienceClient() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

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

  return (
    <div className="ft-experience">
      <header className="ft-exp-header">
        <Link href="/" className="ft-exp-home" aria-label="Home">
          ← Oral Assessments
        </Link>
        <div className="ft-exp-header-controls">
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

      <main className="ft-exp-main">
        <ForkingTreeStepper />
      </main>

      <footer className="ft-exp-footer">
        <span className="ft-exp-footer-title">Related resources</span>
        <div className="ft-exp-footer-links">
          <Link href="/meeting-summary">Meeting Summary</Link>
          <Link href="/mk-first-draft">Full Briefing</Link>
          <Link href="/">Executive Summary</Link>
          <Link href="/takes">Tools for Thinking</Link>
        </div>
      </footer>
    </div>
  );
}
