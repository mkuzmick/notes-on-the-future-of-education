# /index-mw — Index a document with YAML frontmatter

When the user calls `/index-mw`, add YAML frontmatter to a document (or batch of documents) for searchability.

## How it works

1. The user provides a file path (or folder path for batch mode).
2. Read the file content.
3. Generate YAML frontmatter using ONLY tags from the canonical tag list below.
4. Prepend the YAML block to the file (preserving all existing content).
5. If batch mode (folder path), process all `.txt` and `.md` files that don't already have `---` frontmatter.
6. After processing, update the `index.md` file in the nearest parent folder that contains one (or create one in the folder being indexed).

## YAML format

```yaml
---
title: "Short descriptive title"
source_url: "URL if present in the file"
source_title: "Publication or site name"
author: "Author name(s) if identifiable"
date: "Publication date if identifiable (YYYY-MM-DD or YYYY-MM or YYYY)"
type: one of the allowed types below
tags: [from the canonical list below]
summary: "1-2 sentence summary of the key insight or argument"
harvard_relevance: "1 sentence on why this matters for Harvard faculty, if applicable"
---
```

## Allowed types

- research-paper
- news-article
- institutional-policy
- practitioner-guide
- meeting-notes
- case-study
- opinion
- historical-source
- pedagogy-guide
- interview
- literature-review
- pdf-summary

## Canonical tag list

When indexing, select ONLY from these tags. If a document genuinely doesn't fit any existing tag, you may propose a new one — but you MUST:
1. Add it to this skill file's canonical list before using it.
2. Mention the new tag to the user so they can approve or reject it.

### Topic tags
- history
- cognitive-science
- equity
- gender
- neurodivergence
- accessibility
- ai-detection
- ai-tools
- ai-policy
- peer-institutions
- harvard
- rubrics
- grading
- logistics
- scale
- student-experience
- student-anxiety
- professional-domains
- philosophy
- pedagogy
- oral-exam-design
- academic-integrity
- written-vs-oral
- scaffolding
- practice-and-rehearsal
- recording-and-documentation
- feedback
- deep-learning
- memory-and-retention
- law
- medicine
- business
- stem
- humanities
- performance
- discussion
- socratic-method
- viva-voce
- capstone
- low-stakes
- high-stakes
- curriculum-design
- faculty-experience
- tf-training

## Index file format

The `index.md` in each folder should be a table:

```markdown
# Index

| File | Type | Tags | Summary |
|------|------|------|---------|
| [filename.txt](filename.txt) | type | tag1, tag2 | One-line summary |
```

Sort by type, then alphabetically by filename within each type.

## Rules

- Never invent tags outside the canonical list without updating this file first.
- Never alter file content below the `---` closing frontmatter marker.
- If a file already has frontmatter, skip it (unless the user explicitly asks to re-index).
- For PDFs: if there's a companion `.txt` file (e.g., `_PDF-elle-*.txt`), index that. Otherwise note the PDF in the index with whatever metadata the filename provides.
- Extract `source_url` from the first few lines of the file if present.
- Extract `author` and `date` from the "Elle's notes" section or file content if identifiable.
- The `summary` should capture the *key insight*, not just the topic. "Oral exams are good" is bad. "Oral exams for 25-student humanities course took 13 hours vs 15+ for written — practical implementation data" is good.
