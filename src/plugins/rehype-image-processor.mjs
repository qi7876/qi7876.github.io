import { visit } from 'unist-util-visit'

function createFigure(imgNode) {
  const altText = imgNode.properties?.alt
  const shouldSkipCaption = !altText || altText.startsWith('_')
  if (shouldSkipCaption) {
    return imgNode
  }

  const children = [imgNode]

  if (!shouldSkipCaption) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [{ type: 'text', value: altText }],
    })
  }

  return {
    type: 'element',
    tagName: 'figure',
    properties: {},
    children,
  }
}

export function rehypeImageProcessor() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Skip non-paragraph elements, empty paragraphs, and orphaned nodes
      if (node.tagName !== 'p' || !node.children || node.children.length === 0 || !parent) {
        return
      }

      // Collect images from paragraph
      const imgNodes = []
      for (const child of node.children) {
        if (child.tagName === 'img') {
          imgNodes.push(child)
        }
        else if (child.type !== 'text' || child.value.trim() !== '') {
          return // Skip paragraphs with non-image content
        }
      }

      if (imgNodes.length === 0) {
        return
      }

      // Single image: add a caption when alt text allows it
      if (imgNodes.length === 1) {
        const figure = createFigure(imgNodes[0])
        if (figure !== imgNodes[0]) {
          // Only replace if conversion happened
          node.tagName = 'figure'
          node.properties = figure.properties
          node.children = figure.children
        }
        return
      }

      // Multiple images: unwrap the paragraph
      parent.children.splice(index, 1, ...imgNodes)
    })
  }
}
