import fs from "node:fs";
import path from "node:path";

export function walkMarkdownFiles(rootDir) {
  if (!fs.existsSync(rootDir)) return [];

  const out = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) out.push(p);
    }
  }

  walk(rootDir);
  return out.sort(); // deterministic ordering
}
