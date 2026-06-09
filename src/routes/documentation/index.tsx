import PageWrapper from "#/components/layout/page-wrapper.tsx";
import type { TOCItem } from "#/components/pages/documentation/types.ts";
import { Button } from "#/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import { allDocumentations } from "content-collections";
import { BookIcon } from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { createMetaTags } from "#/lib/seo.ts";
import { DocumentationLayout } from "#/components/pages/documentation/documentation-layout.tsx";

export const Route = createFileRoute("/documentation/")({
  head: () => ({
    ...createMetaTags({
      pageName: "Documentation",
      content: "Comprehensive documentation for the Adaptive BE Toolkit.",
    }),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageWrapper ShowHeader={true} ShowFooter={true}>
      <main className="flex flex-col gap-4">
        <h1>Toolkit Documentation</h1>

        <section className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {allDocumentations
            .sort((a, b) => a.index - b.index)
            .map((doc) => (
              <Card key={doc._meta.fileName} className="flex shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {doc.title}
                  </CardTitle>
                  <CardDescription>
                    Last Updated: {new Date(doc.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col grow">
                  <p className="text-sm text-muted-foreground">{doc.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge>
                    <span className="first-letter:uppercase">{doc.type}</span>
                  </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to={`/documentation/$slug`}
                      params={{ slug: doc.slug }}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <BookIcon className="h-4 w-4" />
                      Read More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </section>
      </main>
    </PageWrapper>
  );
}
