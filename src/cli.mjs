#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadConfig } from "./config.mjs";
import { buildContent } from "./compile.mjs";

function usage() {
  console.log(`
flatcontent

Usage:
  flatcontent build [--config <path>] [--content <dir>] [--out <file>]

Examples:
  flatcontent build
  flatcontent build --content content --out public/content.json
`.trim());
}

function parseArgs(argv) {
  const args = { cmd: null, flags: {} };
  const a = argv.slice(2);
  args.cmd = a[0] || null;

  for (let i = 1; i < a.length; i++) {
    const token = a[i];
    if (token === "--content") args.flags.content = a[++i];
    else if (token === "--out") args.flags.out = a[++i];
    else if (token === "--help" || token === "-h") args.flags.help = true;
    else throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  const { cmd, flags } = parseArgs(process.argv);
  if (!cmd || flags.help) {
    usage();
    process.exit(cmd ? 0 : 1);
  }

  if (cmd !== "build") {
    console.error(`Unknown command: ${cmd}`);
    usage();
    process.exit(1);
  }

  const config = loadConfig(process.cwd());
  const contentDir = flags.content || config.contentDir;
  const outFile = flags.out || config.outFile;

  const artifact = buildContent({
    cwd: process.cwd(),
    contentDir,
    collectionsConfig: config.collections
  });

  const absOutFile = path.isAbsolute(outFile) ? outFile : path.join(process.cwd(), outFile);
  ensureDirForFile(absOutFile);
  fs.writeFileSync(absOutFile, JSON.stringify(artifact, null, 2), "utf8");

  console.log(`flatcontent: wrote ${outFile}`);
}

main().catch((e) => {
  console.error(`flatcontent: error: ${e.message}`);
  process.exit(1);
});
