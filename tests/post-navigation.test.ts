import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { it } from "node:test";
import { parse } from "node-html-parser";

it("post list dates and reading times match their article pages", async () => {
  const home = parse(await readFile("dist/index.html", "utf8"));
  const links = home.querySelectorAll('main li h3 a[href^="/posts/"]');
  assert.ok(links.length > 0);

  for (const link of links) {
    const href = link.getAttribute("href");
    assert.ok(href);
    const article = parse(await readFile(join("dist", href, "index.html"), "utf8"));
    const item = link.closest("li");
    assert.ok(item);
    const listTimes = item.querySelectorAll("time");
    const articleTimes = article.querySelectorAll("#post-date time");
    assert.deepEqual(
      listTimes.map((time) => [time.getAttribute("datetime"), time.textContent.trim()]),
      articleTimes.map((time) => [time.getAttribute("datetime"), time.textContent.trim()]),
      href,
    );
    assert.ok(listTimes.length > 0);
    const dateSummary = listTimes[0].parentNode;
    assert.ok(dateSummary);
    const articleSummary = article.querySelector("#post-date");
    assert.ok(articleSummary);
    assert.equal(
      dateSummary.textContent.replace(/\s+/g, " ").trim(),
      articleSummary.textContent.replace(/\s+/g, " ").trim(),
      href,
    );
  }
});

it("navigation marks the current section on home, About, and article pages", async () => {
  for (const [path, label] of [
    ["dist/index.html", "Posts"],
    ["dist/about/index.html", "About"],
    ["dist/posts/coding-agent-guide/index.html", "Posts"],
  ]) {
    const page = parse(await readFile(path, "utf8"));
    const navigation = page.querySelector('nav[aria-label="Site Navigation"]');
    assert.ok(navigation);
    const active = navigation.querySelectorAll('a[aria-current="page"]');
    assert.equal(active.length, 1);
    assert.equal(active[0].textContent.trim(), label);
    assert.equal(navigation.querySelectorAll("a").length, 2);
  }
});
