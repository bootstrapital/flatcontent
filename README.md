# flatcontent

Flatcontent compiles Markdown folders into a single JSON content artifact, suitable for runtime rendering by a static HTML shell (e.g., Pageplane).

## Why
- Keep content in a plain Git repo (Markdown + frontmatter)
- Publish a static `content.json`
- Load it via `fetch()` from any static HTML file

## Install
```bash
npm install -g flatcontent
