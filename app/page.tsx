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

  return <EssayClient markdown={markdown} date="January 2026" />;
}
