import fs from "fs";
import path from "path";
import EssayClient from "../essay-client";

export default function TeachingWriting() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "teaching-writing.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <EssayClient markdown={markdown} date="April 2026" />;
}
