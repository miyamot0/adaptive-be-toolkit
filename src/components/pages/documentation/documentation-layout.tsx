import type { ReactNode } from "react";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import { NavigationSidebar } from "./components/navigation-sidebar.tsx";
import { TableOfContents } from "./components/table-of-contents.tsx";
import type { TOCEntry } from "../../../../content-collections.ts";

interface DocumentationLayoutProps {
  children: ReactNode;
  docs?: any[]; // Will be typed properly when used with content-collections
  tocItems?: TOCEntry[]; // Table of contents items for the current page
}

export function DocumentationLayout({
  children,
  tocItems = [],
}: DocumentationLayoutProps) {
  return (
    <PageWrapper ShowHeader={true} ShowFooter={true} ShowWider={true}>
      <main className="flex flex-col gap-4">
        <div className="grid grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_280px] min-h-[calc(100vh-64px)]">
          <NavigationSidebar />

          <section className="min-h-full py- px-4 lg:px-8 border-r bg-background">
            {children}
          </section>

          <TableOfContents toc={tocItems} />
        </div>
      </main>
    </PageWrapper>
  );
}
