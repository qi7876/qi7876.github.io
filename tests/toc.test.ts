import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { it } from 'node:test'
import { parse } from 'node-html-parser'

async function readPages(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const pages = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      return readPages(path)
    }
    return entry.name.endsWith('.html') ? [await readFile(path, 'utf8')] : []
  }))
  return pages.flat()
}

it('articles expose matching desktop and mobile ToCs outside the article', async () => {
  const pages = await readPages('dist/posts')
  assert.ok(pages.length > 0)
  let withHeadings = 0
  let withoutHeadings = 0
  for (const html of pages) {
    const page = parse(html)
    const article = page.querySelector('article')
    assert.ok(article)
    assert.equal(page.querySelector('#back-button'), null)
    assert.equal(article.querySelector('[aria-label="Table of Contents"]'), null)
    assert.equal(article.querySelector('#toc-button'), null)
    const headings = article.querySelectorAll('#post-content h2, #post-content h3, #post-content h4')
    if (headings.length === 0) {
      withoutHeadings++
      assert.equal(page.querySelector('#toc-desktop'), null)
      assert.equal(page.querySelector('#toc-button'), null)
      assert.equal(page.querySelector('#toc-sheet'), null)
      continue
    }
    withHeadings++
    const sidebar = page.querySelector('.article-sidebar')
    assert.ok(sidebar)
    assert.ok(sidebar.querySelector('header'))
    assert.ok(sidebar.querySelector('#toc-desktop'))
    assert.ok(sidebar.querySelector('nav[aria-label="Site Navigation"]'))
    const expected = headings.map(heading => `#${heading.id}`)
    for (const selector of ['#toc-links-list', '#toc-mobile-links']) {
      const list = page.querySelector(selector)
      assert.ok(list)
      assert.deepEqual(list.querySelectorAll('a').map(link => link.getAttribute('href')), expected)
    }
    assert.equal(page.querySelector('#toc-button')?.getAttribute('aria-controls'), 'toc-sheet')
    assert.equal(page.querySelector('#toc-sheet')?.tagName, 'DIALOG')
  }
  assert.ok(withHeadings > 0)
  assert.ok(withoutHeadings > 0)
})

it('home and About have no article ToC controls', async () => {
  for (const path of ['dist/index.html', 'dist/about/index.html']) {
    const page = parse(await readFile(path, 'utf8'))
    assert.equal(page.querySelector('#toc-button'), null)
    assert.equal(page.querySelector('#toc-desktop'), null)
    assert.equal(page.querySelector('#toc-sheet'), null)
  }
})
