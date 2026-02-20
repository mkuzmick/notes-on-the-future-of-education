import fs from "fs";
import path from "path";
import EssayClient from "../essay-client";

export default function OralExams() {
  const filePath = path.join(
    process.cwd(),
    "content",
    "oral-exams.md"
  );
  const markdown = fs.readFileSync(filePath, "utf-8");

  return <EssayClient markdown={markdown} date="February 2026" />;
}
