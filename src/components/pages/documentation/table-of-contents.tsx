import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { TOCItem } from "./types";

interface TableOfContentsProps {
  toc: TOCItem[];
  maxDepth?: number;
}

export function TableOfContents({ toc, maxDepth = 2 }: TableOfContentsProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollToItem = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderTocItems = (items: TOCItem[], depth: number) => {
    if (depth > maxDepth || items.length === 0) return null;

    return (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-1 text-left w-full p-1 rounded ${
                openItems.has(item.id) ? "text-muted-foreground" : ""
              }`}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
              {item.children && item.children.length > 0 && (
                <span className="text-xs">
                  {openItems.has(item.id) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </span>
              )}
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToItem(item.id);
                }}
                className="text-sm hover:underline"
              >
                {item.title}
              </a>
            </button>
            {item.children && item.children.length > 0 && (
              <TableOfContents toc={item.children} maxDepth={maxDepth} />
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4 border-l bg-background">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          On This Page
        </h3>
        {toc.length > 0 ? (
          renderTocItems(toc, 1)
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No table of contents available.
          </p>
        )}
      </div>
    </aside>
  );
}
