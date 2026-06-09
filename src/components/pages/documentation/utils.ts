import type { TOCItem } from "./types";

/**
 * Extracts headings from MDX content and builds a table of contents structure.
 * @param mdxContent - The raw MDX source code
 * @returns Array of TOC items with heading hierarchy
 */
export function extractHeadingsFromMdx(mdxContent: string): TOCItem[] {
  const lines = mdxContent.split("\n");
  const tocItems: TOCItem[] = [];
  let currentParent: TOCItem | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match markdown headings (# through ######)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      // Create anchor ID from heading text
      const id = createHeadingId(title);

      const tocItem: TOCItem = {
        level,
        title,
        id,
      };

      // Build hierarchy based on heading depth
      if (level === 1) {
        // H1 is root level - clear any existing parents
        currentParent = null;
      } else if (currentParent && currentParent.level < level) {
        // New deeper level - find the parent at previous level
        const newParent = findItemAtLevel(tocItems, level - 1);
        if (newParent) {
          currentParent = newParent;
        }
      } else if (currentParent && currentParent.level >= level) {
        // New shallower or equal level - replace parent chain
        const newParent = findItemAtLevel(tocItems, level - 1);
        if (newParent) {
          currentParent = newParent;
        }
      }

      // Add to parent's children or as root item
      if (currentParent) {
        if (!currentParent.children) {
          currentParent.children = [];
        }
        currentParent.children.push(tocItem);
      } else {
        tocItems.push(tocItem);
      }

      // Update current parent for next iteration
      currentParent = tocItem;
    }
  }

  return tocItems;
}

/**
 * Creates a URL-safe anchor ID from heading text.
 */
function createHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Finds an item at a specific level in the TOC array.
 */
function findItemAtLevel(items: TOCItem[], level: number): TOCItem | null {
  for (const item of items) {
    if (item.level === level) {
      return item;
    }
    // Recursively search children
    if (item.children && item.children.length > 0) {
      const found = findItemAtLevel(item.children, level);
      if (found) return found;
    }
  }
  return null;
}
