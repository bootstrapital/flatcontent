# flatcontent

Flatcontent compiles Markdown folders into a single JSON content artifact, suitable for runtime rendering by a static HTML shell (e.g., [Pageplane](https://pageplane.app?utm_source=flatcontent-repo)).

## Why
- Keep content in a plain Git repo (Markdown + frontmatter)
- Publish a static `content.json`
- Load it via `fetch()` from any static HTML file

## Install
```bash
npm install flatcontent
```

> Example usage: https://github.com/bootstrapital/pageplane-content

### TODO: Add better setup instructions

```
# WIP
1. Create `flatcontent.config.json`
2. Copy github action from [example](https://github.com/bootstrapital/pageplane-content)
3. In repo, settings > GH Pages > Deploy from GH Action
```
