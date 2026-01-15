import fs from "node:fs";
import path from "node:path";

export function loadConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, "flatcontent.config.json");

  const defaults = {
    contentDir: "content",
    outFile: "public/content.json",
    collections: {} // optional overrides
  };

  if (!fs.existsSync(configPath)) return { ...defaults, _configPath: null };

  const raw = fs.readFileSync(configPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in flatcontent.config.json: ${e.message}`);
  }

  return {
    ...defaults,
    ...parsed,
    _configPath: configPath
  };
}
