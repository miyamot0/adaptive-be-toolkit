import { Link, useLocation } from "@tanstack/react-router";
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

interface NavigationSidebarProps {
  docs: Documentation[];
  currentSlug?: string;
}

export function NavigationSidebar({
  docs,
  currentSlug,
}: NavigationSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Group documentation by type
  const groupedDocs = groupByType(docs);

  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4 border-r bg-background">
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
                      <span className="text-xs text-muted-foreground mt-1">
                        {doc.index + 1}
                      </span>
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

function groupByType(docs: Documentation[]): GroupedDocs {
  const grouped = new Map<string, Documentation[]>();
  docs.forEach((doc) => {
    if (!grouped.has(doc.type)) {
      grouped.set(doc.type, []);
    }
    grouped.get(doc.type)?.push(doc);
  });

  return Object.fromEntries(grouped.entries()) as GroupedDocs;
}

function getIconForType(type: string): React.ReactNode {
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

function formatTypeName(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
