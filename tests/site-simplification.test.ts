import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import { parse } from 'node-html-parser'

test('single-site pages keep content and use English interface labels', async () => {
  const home = parse(await readFile('dist/index.html', 'utf8'))
  const about = parse(await readFile('dist/about/index.html', 'utf8'))
  const post = parse(await readFile('dist/posts/attention-sinks/index.html', 'utf8'))

  for (const page of [home, about, post]) {
    assert.equal(page.querySelector('html')?.getAttribute('lang'), 'en')
    assert.deepEqual(
      page.querySelectorAll('nav[aria-label="Site Navigation"] a').map(link => link.text.trim()),
      ['Posts', 'About'],
    )
    assert.equal(page.querySelector('#language-switcher'), null)
    assert.equal(page.querySelector('#twikoo, #waline, .giscus'), null)
  }

  assert.equal(home.querySelector('title')?.text, 'qi-blog')
  assert.ok(home.querySelector('a[href="/posts/attention-sinks/"]'))
  assert.match(about.querySelector('.heti')?.text ?? '', /我是qi，很高兴遇见你/)
  assert.equal(post.querySelector('#toc-mobile-text')?.text.trim(), 'Table of Contents')
})

test('feeds use single-route links', async () => {
  const rss = await readFile('dist/rss.xml', 'utf8')
  const atom = await readFile('dist/atom.xml', 'utf8')

  assert.match(rss, /https:\/\/qi7876\.github\.io\/posts\/attention-sinks\//)
  assert.match(atom, /https:\/\/qi7876\.github\.io\/posts\/attention-sinks\//)
  assert.doesNotMatch(rss + atom, /https:\/\/qi7876\.github\.io\/(?:en|zh)\/posts\//)
})
