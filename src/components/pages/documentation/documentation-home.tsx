import type { TOCItem } from "./types.ts";
import { DocumentationLayout } from "./documentation-layout.tsx";

interface DocumentationHomeProps {
  tocItems?: TOCItem[];
}

export default function DocumentationHome({
  tocItems,
}: DocumentationHomeProps) {
  // Filter only general type docs for the home page TOC

  return (
    <DocumentationLayout tocItems={tocItems}>
      <main className="flex flex-col gap-2">
        {/* Outlet placeholder - for future TanStack Router integration */}
        {/* When using TanStack Router outlet, content will be rendered here automatically */}

        {/* Blank/default view when no outlet is connected */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Documentation
          </h1>
          <p className="text-muted-foreground">
            Browse the documentation on the left. Select a page to view its
            contents.
          </p>

          {/* TOC items for current page (if available) */}
          {tocItems && tocItems.length > 0 && (
            <section className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-semibold mb-4">On This Page</h2>
              <div className="space-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </DocumentationLayout>
  );
}
