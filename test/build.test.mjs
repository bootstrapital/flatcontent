import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { buildContent } from "../src/compile.mjs";

test("buildContent compiles markdown into collections", () => {
  const cwd = path.join(process.cwd(), "test", "fixtures");
  const artifact = buildContent({ cwd, contentDir: "content" });

  assert.equal(artifact.version, 1);
  assert.ok(artifact.generated_at);

  assert.ok(artifact.collections.blog);
  assert.ok(artifact.collections.docs);

  const blog0 = artifact.collections.blog[0];
  assert.equal(blog0.slug, "hello-world");
  assert.equal(blog0.title, "Hello World");
  assert.ok(blog0.html.includes("<h1"));

  const docs0 = artifact.collections.docs[0];
  assert.equal(docs0.title, "Getting Started");
});
