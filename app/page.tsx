import fs from "fs";
import path from "path";
import EssayClient from "./essay-client";

export default function Home() {
  const filePath = path.join(
    process.cwd(),
    "_content",
    "docs",
    "executive-summary.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return (
    <EssayClient
      markdown={markdown}
      date="March 2026"
      links={[
        { href: "/meeting-summary", label: "Meeting Summary" },
        { href: "/forking-tree", label: "The Forking Tree" },
        { href: "/takes", label: "Tools for Thinking" },
        { href: "/mk-first-draft", label: "Full Briefing" },
        { href: "/history-lens", label: "The Historical Lens" },
        { href: "/folklore-lens", label: "The Folklore Lens" },
      ]}
    />
  );
}
