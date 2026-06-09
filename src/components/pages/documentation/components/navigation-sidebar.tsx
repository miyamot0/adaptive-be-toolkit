import { Link, useLocation } from "@tanstack/react-router";
import { allDocumentations } from "content-collections";

import { BookOpen, FileText, DollarSign, TrendingUp } from "lucide-react";

interface Documentation {
  slug: string;
  title: string;
  description: string;
  summary: string;
  index: number;
  type: "general" | "discounting" | "demand";
  date: string;
}

type GroupedDocs = Record<string, Documentation[]>;

/**
 * Groups documentation entries by their 'type' field.
 *
 * @param {Documentation[]} docs
 * @return {*}  {GroupedDocs}
 */
function groupByType(docs: Documentation[]): GroupedDocs {
  const grouped = new Map<string, Documentation[]>();
  docs.forEach((doc) => {
    if (!grouped.has(doc.type)) {
      grouped.set(doc.type, []);
    }
    grouped.get(doc.type)?.push(doc);
  });

  return Object.fromEntries(grouped.entries());
}

/**
 * Returns an appropriate icon component based on the documentation type.
 *
 * @param {string} type
 * @return {*}
 */
function getIconForType(type: string) {
  switch (type) {
    case "general":
      return <BookOpen className="h-4 w-4" />;
    case "discounting":
      return <DollarSign className="h-4 w-4" />;
    case "demand":
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

/**
 * Formats the documentation type name for display purposes.
 *
 * @param {string} type
 * @return {string}
 */
function formatTypeName(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function NavigationSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const groupedDocs = groupByType(allDocumentations);

  return (
    <aside className="w-64 shrink-0">
      <nav className="sticky top-14 h-[calc(100vh-56px)] overflow-y-auto p-4 border-r bg-background">
        <div className="space-y-8">
          {Object.entries(groupedDocs).map(([type, typeDocs]) => (
            <section key={type} className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                {getIconForType(type)}
                {formatTypeName(type)}
              </h3>
              <ul className="space-y-1">
                {typeDocs.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      to={`/documentation/$slug`}
                      params={{ slug: doc.slug }}
                      className={`flex items-start gap-2 p-2 rounded-md transition-colors ${
                        pathname === `/documentation/${doc.slug}/`
                          ? "bg-muted text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="flex-1 truncate">{doc.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </nav>
    </aside>
  );
}
