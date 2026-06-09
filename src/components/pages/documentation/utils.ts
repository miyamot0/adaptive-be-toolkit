import type { TOCItem } from "./types";

/**
 * Extracts headings from MDX content and builds a table of contents structure.
 * @param mdxCode - The raw MDX source code (not compiled)
 * @returns Array of TOC items with heading hierarchy
 */
export function extractHeadingsFromMdx(mdxCode: string): TOCItem[] {
  const lines = mdxCode.split("\n");
  const tocItems: TOCItem[] = [];

  console.log(lines);

  // Skip frontmatter (lines starting with ---)
  let inFrontmatter = false;
  let currentParent: TOCItem | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "---") {
      inFrontmatter = !inFrontmatter;
      continue;
    }

    // Only process outside frontmatter
    if (inFrontmatter) continue;

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
        // H1 is root level - clear any existing parents and add as root item
        currentParent = null;
        tocItems.push(tocItem);
      } else if (!currentParent || currentParent.level >= level) {
        // New shallower or equal level - find parent at previous level
        const newParent = findItemAtLevel(tocItems, level - 1);
        if (newParent) {
          currentParent = newParent;
          if (!newParent.children) {
            newParent.children = [];
          }
          newParent.children.push(tocItem);
        } else {
          // No parent found at this level, add as root item
          tocItems.push(tocItem);
        }
      } else {
        // Deeper level - add to current parent's children
        if (!currentParent.children) {
          currentParent.children = [];
        }
        currentParent.children.push(tocItem);
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
