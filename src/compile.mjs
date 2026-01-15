import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { walkMarkdownFiles } from "./fswalk.mjs";
import { slugify, relPosix, isTruthy } from "./util.mjs";
import { makeEnvelope } from "./schema.mjs";

function inferCollection(contentDir, filePath) {
  const rel = relPosix(contentDir, filePath);
  const [top] = rel.split("/");
  return top || "misc";
}

function inferSlug(filePath, fm) {
  if (fm?.slug) return String(fm.slug);
  const base = path.basename(filePath, path.extname(filePath));
  return slugify(base);
}

function inferTitle(filePath, fm, body) {
  if (fm?.title) return String(fm.title);

  const m = body.match(/^#\s+(.+)\s*$/m);
  if (m) return m[1].trim();

  return path.basename(filePath, path.extname(filePath));
}

function parseDateISO(fm) {
  if (!fm?.date) return null;
  const d = new Date(fm.date);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function sortItems(name, items, rule) {
  const effective = rule || (name === "blog" ? "date_desc" : "title_asc");

  if (effective === "date_desc") {
    items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return;
  }
  if (effective === "date_asc") {
    items.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return;
  }
  if (effective === "title_desc") {
    items.sort((a, b) => b.title.localeCompare(a.title));
    return;
  }
  // default title_asc
  items.sort((a, b) => a.title.localeCompare(b.title));
}

export function buildContent({ cwd = process.cwd(), contentDir, collectionsConfig = {} }) {
  const absContentDir = path.isAbsolute(contentDir)
    ? contentDir
    : path.join(cwd, contentDir);

  const files = walkMarkdownFiles(absContentDir);

  const collections = {};

  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const parsed = matter(raw);

    const collection = inferCollection(absContentDir, f);
    const slug = inferSlug(f, parsed.data);
    const title = inferTitle(f, parsed.data, parsed.content);
    const date = parseDateISO(parsed.data);

    const draft = isTruthy(parsed.data?.draft);
    // Default behavior: exclude drafts
    if (draft) continue;

    const html = marked.parse(parsed.content);

    if (!collections[collection]) collections[collection] = [];

    collections[collection].push({
      slug,
      title,
      date,
      html,
      tags: Array.isArray(parsed.data?.tags) ? parsed.data.tags.map(String) : [],
      source_path: relPosix(absContentDir, f),
      raw_markdown: parsed.content
    });
  }

  // sorting
  for (const [name, items] of Object.entries(collections)) {
    const rule = collectionsConfig?.[name]?.sort;
    sortItems(name, items, rule);
  }

  return makeEnvelope({
    generatedAtISO: new Date().toISOString(),
    collections
  });
}
