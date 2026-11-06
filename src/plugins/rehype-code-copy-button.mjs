import { SKIP, visit } from "unist-util-visit";

export function rehypeCodeCopyButton() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || node.children?.[0]?.tagName !== "code" || !parent) {
        return;
      }

      if (node._hasCopyButton) {
        return;
      }

      node._hasCopyButton = true;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block-wrapper"] },
        children: [
          {
            type: "element",
            tagName: "button",
            properties: {
              className: ["code-copy-button"],
              type: "button",
              "aria-label": "Copy code",
            },
            children: [{ type: "text", value: "Copy" }],
          },
          node,
        ],
      };

      return SKIP;
    });
  };
}
