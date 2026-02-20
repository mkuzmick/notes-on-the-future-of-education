import fs from "fs";
import path from "path";
import EssayClient from "../essay-client";

export default function ForwardSentries() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "forward-sentries.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <EssayClient markdown={markdown} date="February 2026" />;
}
