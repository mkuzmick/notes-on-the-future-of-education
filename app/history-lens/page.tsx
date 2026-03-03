import fs from "fs";
import path from "path";
import EssayClient from "../essay-client";

export default function HistoryLens() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "history-lens.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return (
    <EssayClient
      markdown={markdown}
      date="March 2026"
      links={[
        { href: "/", label: "Executive Summary" },
        { href: "/takes", label: "Tools for Thinking" },
        { href: "/mk-first-draft", label: "Full Briefing" },
        { href: "/folklore-lens", label: "The Folklore Lens" },
      ]}
    />
  );
}
