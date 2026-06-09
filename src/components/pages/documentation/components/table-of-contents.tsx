import type { TOCEntry } from "../../../../../content-collections";

interface TableOfContentsProps {
  toc: TOCEntry[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto p-4 border-l bg-background">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          On This Page
        </h3>
        <ul className="space-y-2">
          {toc.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
