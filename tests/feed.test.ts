import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { it } from 'node:test'
import { parse } from 'node-html-parser'
import { base, themeConfig } from '../src/config'

it('RSS and Atom images use absolute URLs backed by published assets', async () => {
  const site = new URL(themeConfig.site.url)

  for (const path of ['dist/rss.xml', 'dist/atom.xml']) {
    const xml = await readFile(path, 'utf8')
    const images = [...xml.matchAll(/<!\[CDATA\[([\s\S]*?)\]\]>/g)]
      .flatMap(match => parse(match[1]).querySelectorAll('img'))
    assert.ok(images.length > 0, `${path} must exercise feed images`)
    let localImages = 0

    for (const image of images) {
      const src = image.getAttribute('src')
      assert.ok(src, `Missing image source in ${path}`)
      const url = new URL(src)
      assert.ok(url.protocol === 'https:' || url.protocol === 'http:', src)

      if (url.origin === site.origin) {
        localImages++
        assert.ok(url.pathname.startsWith(`${base}/`), src)
        const assetPath = decodeURIComponent(url.pathname.slice(base.length + 1))
        await access(join('dist', assetPath))
      }
    }

    assert.ok(localImages > 0, `${path} must exercise local attachments`)
  }
})
