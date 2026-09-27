import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
// The project uses Node's built-in test runner to avoid another test dependency.
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import fg from 'fast-glob'
import { parse } from 'node-html-parser'

test('generated pages reference existing local images', async () => {
  const htmlFiles = await fg('dist/**/*.html')
  assert.ok(htmlFiles.length > 0, 'the site must be built before checking image links')

  for (const htmlFile of htmlFiles) {
    const route = `/${path.relative('dist', htmlFile).replaceAll(path.sep, '/').replace(/index\.html$/, '')}`
    const document = parse(await readFile(htmlFile, 'utf8'))

    for (const image of document.querySelectorAll('img')) {
      const src = image.getAttribute('src')
      if (!src) {
        continue
      }

      const url = new URL(src, `https://site.invalid${route}`)
      if (url.origin !== 'https://site.invalid') {
        continue
      }

      const imagePath = path.join('dist', decodeURIComponent(url.pathname).slice(1))
      await assert.doesNotReject(access(imagePath), `${htmlFile}: missing image ${src}`)
    }
  }
})
