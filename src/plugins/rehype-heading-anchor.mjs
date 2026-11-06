import { SKIP, visit } from "unist-util-visit";

export function rehypeHeadingAnchor() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (["h1", "h2", "h3", "h4"].includes(node.tagName) && node.properties?.id) {
        // Extract heading text
        let headingText = "";
        visit(node, "text", (textNode) => {
          headingText += textNode.value;
        });

        // Create anchor link
        node.children.push({
          type: "element",
          tagName: "a",
          properties: {
            href: `#${node.properties.id}`,
            className: ["heading-anchor-link"],
            ariaLabel: headingText
              ? `Link to ${headingText.replace(/["']/g, (char) => (char === '"' ? "&quot;" : "&#39;"))}`
              : undefined,
          },
          children: [{ type: "text", value: "#" }],
        });

        return [SKIP];
      }
    });
  };
}
