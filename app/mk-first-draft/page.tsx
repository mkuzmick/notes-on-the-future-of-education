import fs from "fs";
import path from "path";
import EssayClient from "../essay-client";

export default function MkFirstDraft() {
  const filePath = path.join(
    process.cwd(),
    "_content",
    "docs",
    "mk-first-draft.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return (
    <EssayClient
      markdown={markdown}
      date="February 2026"
      links={[
        { href: "/", label: "Executive Summary" },
        { href: "/takes", label: "Tools for Thinking" },
        { href: "/history-lens", label: "The Historical Lens" },
        { href: "/folklore-lens", label: "The Folklore Lens" },
      ]}
    />
  );
}
