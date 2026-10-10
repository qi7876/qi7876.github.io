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
      assert.equal(page.querySelector('#toc-panel'), null)
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
      for (const [index, link] of list.querySelectorAll('a').entries()) {
        const branch = link.querySelector('.toc-branch')
        assert.equal(branch?.textContent, '└')
        assert.equal(branch?.getAttribute('aria-hidden'), 'true')
        const depth = Number(headings[index].tagName.slice(1)) - 2
        const indentation = link.parentNode?.getAttribute('style')?.match(/--toc-depth:\s*(\d+)/)
        assert.ok(indentation)
        assert.equal(Number(indentation[1]), depth)
      }
    }
    for (const selector of ['#toc-desktop', '#toc-panel']) {
      const toc = page.querySelector(selector)
      assert.ok(toc)
      assert.ok(toc.classList.contains('font-mono'))
      assert.equal(toc.querySelector('h2')?.textContent, 'TREE')
      const progress = toc.querySelector('[role="progressbar"]')
      assert.ok(progress)
      assert.equal(progress.getAttribute('aria-label'), 'Reading progress')
      assert.equal(progress.getAttribute('aria-valuemin'), '0')
      assert.equal(progress.getAttribute('aria-valuemax'), '100')
      assert.equal(progress.getAttribute('aria-valuenow'), '0')
      assert.equal(progress.querySelector('.toc-progress-percent')?.textContent, '00%')
      const headingList = toc.querySelector('ul')
      assert.ok(headingList)
      assert.ok(toc.childNodes.indexOf(progress) > toc.childNodes.indexOf(headingList))
    }
    const trigger = page.querySelector('#toc-button')
    const panel = page.querySelector('#toc-panel')
    assert.ok(trigger)
    assert.ok(panel)
    assert.equal(trigger.getAttribute('aria-controls'), panel.id)
    assert.equal(trigger.getAttribute('aria-haspopup'), 'dialog')
    assert.equal(trigger.getAttribute('aria-expanded'), 'false')
    assert.equal(trigger.getAttribute('aria-label'), 'Open table of contents')
    assert.equal(panel.tagName, 'DIALOG')
    assert.equal(panel.hasAttribute('open'), false)
    assert.equal(panel.getAttribute('aria-labelledby'), panel.querySelector('h2')?.id)
    assert.equal(panel.querySelector('button'), null)
  }
  assert.ok(withHeadings > 0)
  assert.ok(withoutHeadings > 0)
})

it('home and About have no article ToC controls', async () => {
  for (const path of ['dist/index.html', 'dist/about/index.html']) {
    const page = parse(await readFile(path, 'utf8'))
    assert.equal(page.querySelector('#toc-button'), null)
    assert.equal(page.querySelector('#toc-desktop'), null)
    assert.equal(page.querySelector('#toc-panel'), null)
  }
})
