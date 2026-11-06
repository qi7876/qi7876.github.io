import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { it } from "node:test";
import { parse } from "node-html-parser";

async function readPages(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return readPages(path);
      }
      return entry.name.endsWith(".html") ? [await readFile(path, "utf8")] : [];
    }),
  );
  return pages.flat();
}

it("articles retain content and navigation without table of contents controls", async () => {
  const pages = await readPages("dist/posts");
  assert.ok(pages.length > 0);
  for (const html of pages) {
    const page = parse(html);
    assert.ok(page.querySelector("article #post-content"));
    assert.ok(page.querySelector("header"));
    assert.ok(page.querySelector('nav[aria-label="Site Navigation"]'));
    assert.equal(page.querySelector("#back-button"), null);
    for (const selector of ["#toc-desktop", "#toc-button", "#toc-panel", ".sidebar-toc"]) {
      assert.equal(page.querySelector(selector), null);
    }
  }
});

it("home and About have no article ToC controls", async () => {
  for (const path of ["dist/index.html", "dist/about/index.html"]) {
    const page = parse(await readFile(path, "utf8"));
    assert.equal(page.querySelector("#toc-button"), null);
    assert.equal(page.querySelector("#toc-desktop"), null);
    assert.equal(page.querySelector("#toc-panel"), null);
  }
});
