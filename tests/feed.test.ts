import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { it } from "node:test";
import { parse } from "node-html-parser";

it("the site does not publish or advertise RSS and Atom feeds", async () => {
  for (const path of ["dist/rss.xml", "dist/atom.xml", "dist/feeds"]) {
    await assert.rejects(access(path), { code: "ENOENT" });
  }

  for (const path of ["dist/index.html", "dist/about/index.html"]) {
    const page = parse(await readFile(path, "utf8"));
    assert.equal(page.querySelector('link[type="application/rss+xml"]'), null);
    assert.equal(page.querySelector('link[type="application/atom+xml"]'), null);
    assert.equal(page.querySelector('a[href="/rss.xml"], a[href="/atom.xml"]'), null);
    assert.ok(page.querySelector('footer a[href="https://github.com/qi7876"]'));
    assert.ok(page.querySelector('footer a[href="mailto:qi7876@gmail.com"]'));
  }
});
