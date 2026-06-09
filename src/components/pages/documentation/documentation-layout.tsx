import type { ReactNode } from "react";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import { NavigationSidebar } from "./navigation-sidebar.tsx";
import { TableOfContents } from "./table-of-contents.tsx";

interface DocumentationLayoutProps {
  children: ReactNode;
  docs?: any[]; // Will be typed properly when used with content-collections
}

export function DocumentationLayout({
  children,
  docs,
}: DocumentationLayoutProps) {
  return (
    <PageWrapper ShowHeader={true} ShowFooter={true} ShowWider={true}>
      <main className="flex flex-col gap-4">
        <div className="grid grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_280px] min-h-[calc(100vh-64px)]">
          {/* Left Sidebar - Navigation */}
          <NavigationSidebar docs={docs || []} />

          {/* Center Content Area */}
          <section className="min-h-full py-8 px-4 lg:px-8 border-r bg-background">
            {children}
          </section>

          {/* Right Sidebar - Table of Contents */}
          <TableOfContents toc={[]} maxDepth={2} />
        </div>
      </main>
    </PageWrapper>
  );
}
