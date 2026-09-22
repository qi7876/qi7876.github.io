import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
// The project uses Node's built-in test runner to avoid another test dependency.
// eslint-disable-next-line test/no-import-node-test
import test from 'node:test'
import fg from 'fast-glob'

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  }
  catch {
    return false
  }
}

test('post frontmatter does not define tags', async () => {
  const postPaths = await fg('src/content/posts/**/*.{md,mdx}')

  for (const postPath of postPaths) {
    const source = await readFile(postPath, 'utf8')
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]

    assert.ok(frontmatter, `${postPath} must have frontmatter`)
    assert.doesNotMatch(frontmatter, /^tags:/m, `${postPath} still defines tags`)
  }
})

test('tag routes and components are removed', async () => {
  const removedPaths = [
    'src/components/TagList.astro',
    'src/pages/[...lang]/tags',
    'dist/tags',
    'dist/en/tags',
  ]

  for (const removedPath of removedPaths) {
    assert.equal(await pathExists(removedPath), false, `${removedPath} still exists`)
  }
})

test('generated pages and sitemap do not link to tag routes', async () => {
  const outputPaths = await fg(['dist/**/*.html', 'dist/sitemap-*.xml'])

  for (const outputPath of outputPaths) {
    const output = await readFile(outputPath, 'utf8')
    assert.doesNotMatch(output, /(?:href=|<loc>)["']?[^<"']*\/tags\//, `${outputPath} still links to a tag route`)
  }
})
