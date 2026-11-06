import assert from "node:assert/strict";
import { it } from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { parse } from "node-html-parser";
import { remarkDisableBareAutolinks } from "../src/plugins/remark-disable-bare-autolinks.mjs";
import { rehypeExternalLinks } from "../src/plugins/rehype-external-links.mjs";

const renderer = await createMarkdownProcessor({
  syntaxHighlight: false,
  remarkPlugins: [remarkDisableBareAutolinks],
  rehypePlugins: [rehypeExternalLinks],
});

it("bare URLs, domains, and email addresses remain text, including adjacent links", async () => {
  const markdown = [
    "https://example.com/one http://example.com/two www.example.com user@example.com",
    "",
    "中文 https://example.com/three，以及 https://example.com/four。",
    "",
    "[Explicit](https://example.com/explicit) https://example.com/bare [Relative](/about/)",
  ].join("\n");
  const page = parse((await renderer.render(markdown)).code);
  assert.deepEqual(
    page.querySelectorAll("a").map((link) => link.getAttribute("href")),
    ["https://example.com/explicit", "/about/"],
  );
  for (const text of ["https://example.com/one", "www.example.com", "user@example.com"]) {
    assert.ok(page.textContent.includes(text));
  }
});

it("explicit inline, reference, and angle links retain their behavior", async () => {
  const page = parse(
    (
      await renderer.render(
        [
          "[Inline](https://example.com/inline) [Reference][ref] [ref]",
          "",
          "[ref]: https://example.com/reference",
          "",
          "<https://example.com/angle> <user@example.com> [Local](/about/)",
        ].join("\n"),
      )
    ).code,
  );
  const links = page.querySelectorAll("a");
  assert.deepEqual(
    links.map((link) => link.getAttribute("href")),
    [
      "https://example.com/inline",
      "https://example.com/reference",
      "https://example.com/reference",
      "https://example.com/angle",
      "mailto:user@example.com",
      "/about/",
    ],
  );
  assert.equal(links[0].getAttribute("target"), "_blank");
  assert.equal(links[0].getAttribute("rel"), "noopener noreferrer");
});

it("GFM tables, strikethrough, tasks, and code retain their syntax", async () => {
  const page = parse(
    (
      await renderer.render(
        [
          "| Link |",
          "| --- |",
          "| https://example.com/table |",
          "",
          "~~removed~~",
          "",
          "- [x] done",
          "",
          "`https://example.com/inline-code`",
          "",
          "```text",
          "https://example.com/code",
          "```",
        ].join("\n"),
      )
    ).code,
  );
  assert.ok(page.querySelector("table"));
  assert.equal(page.querySelector("del")?.textContent, "removed");
  assert.ok(page.querySelector('input[type="checkbox"][checked]'));
  assert.equal(page.querySelector("p code")?.textContent, "https://example.com/inline-code");
  assert.ok(page.querySelector("pre")?.textContent.includes("https://example.com/code"));
  assert.equal(page.querySelector("a"), null);
});
