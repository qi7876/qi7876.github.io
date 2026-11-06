import { SKIP, visit } from "unist-util-visit";

export function remarkDisableBareAutolinks() {
  return (tree, file) => {
    const source = file.toString();
    visit(tree, "link", (node, index, parent) => {
      const start = node.position?.start.offset;
      if (!parent || index === undefined || start === undefined) {
        return;
      }

      // Explicit CommonMark links start with [ or <; GFM bare autolinks do not.
      if (source[start] === "[" || source[start] === "<") {
        return;
      }

      parent.children.splice(index, 1, ...node.children);
      return [SKIP, index + node.children.length];
    });
  };
}
