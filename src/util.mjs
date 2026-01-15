import path from "node:path";

export function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function relPosix(from, to) {
  // ensure stable slashes across OS
  return path.relative(from, to).split(path.sep).join("/");
}

export function isTruthy(v) {
  return v === true || v === "true" || v === 1 || v === "1";
}
