# /search-mw — Search indexed documents for relevant context

When the user calls `/search-mw`, search through YAML-frontmattered documents to find sources relevant to the current task.

## How it works

1. Determine what the user needs context for — either from their explicit query or from the current conversation context (e.g., "I'm revising section 3 of the meeting summary" → search for tags related to that section's content).
2. Read the `index.md` file(s) in the raw content folders to get an overview of what's available.
3. Filter by relevant tags, types, or keywords.
4. Read the full content of the most promising files (up to ~10).
5. Return a structured digest to the user.

## Search strategy

1. **Start with the index.** Read `index.md` files to scan summaries and tags without opening every file.
2. **Filter by tags first.** Match the user's task to canonical tags from the `/index-mw` skill.
3. **Then grep for specifics.** If the user is looking for something not captured by tags (a specific author, institution, statistic), use Grep across the raw folders.
4. **Read promising files in full.** For the top matches, read the complete file to extract quotes, data points, and arguments.
5. **Check for PDFs.** Note any relevant PDFs that may contain additional detail not in the text summaries.

## Output format

Return results as a structured digest:

```markdown
## Search Results: [query/topic]

### Most Relevant (directly addresses the question)
- **[filename]** — type | tags
  Key finding: [specific quote or data point]

### Supporting Context (background or related)
- **[filename]** — type | tags
  Relevant because: [1 sentence]

### PDFs to Check (may contain more detail)
- **[filename.pdf]** — [what we know about it]
```

## Rules

- Always start with the index before reading individual files.
- Prioritize files with frontmatter (they've been vetted). For un-indexed files, note them but flag that they haven't been reviewed.
- When pulling quotes or data, include enough context that the user can evaluate relevance without opening the file.
- If the search doesn't find enough, say so — don't pad results with marginally relevant files.
- If many files are un-indexed, suggest running `/index-mw` on the folder first.
- Never fabricate content that isn't in the source files. If a file's "Elle's notes" says something, attribute it to that annotation, not to the original source (unless the original text is also present below the `--` separator).
