import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { allDocumentations } from "content-collections";
import type { Documentation } from "content-collections";
import { MarkdownComponents } from "#/components/markdown/markdown-components.tsx";
import { MDXContent } from "@content-collections/mdx/react";
import { Button } from "#/components/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createMetaTags } from "#/lib/seo.ts";
import { DocumentationLayout } from "#/components/pages/documentation/documentation-layout.tsx";
import { createSlugger } from "#/lib/utils.ts";

export const Route = createFileRoute("/documentation/$slug/")({
  beforeLoad: async ({ params }) => {
    const doc = allDocumentations.find(
      (local_doc) => local_doc.slug === params.slug,
    );

    if (!doc) {
      throw redirect({
        to: "/documentation",
      });
    }

    return { params };
  },
  loader: async ({ params }) => {
    const currentDoc: Documentation | undefined = allDocumentations.find(
      (doc) => doc.slug === params.slug,
    );

    const nextDoc: Documentation | undefined = allDocumentations.find(
      (doc) => doc.index === currentDoc!.index + 1,
    );
    const prevDoc: Documentation | undefined = allDocumentations.find(
      (doc) => doc.index === currentDoc!.index - 1,
    );

    // Extract table of contents from MDX content
    const tocItems = currentDoc!.toc;

    return { currentDoc, nextDoc, prevDoc, tocItems };
  },
  component: RouteComponent,
  head: ({ loaderData }) => ({
    ...createMetaTags({
      pageName: loaderData!.currentDoc!.title,
      content: loaderData!.currentDoc!.summary,
    }),
  }),
});

function RouteComponent() {
  const { currentDoc, nextDoc, prevDoc, tocItems } = Route.useLoaderData();

  const mdxSlugger = createSlugger();

  return (
    <DocumentationLayout docs={allDocumentations} tocItems={tocItems}>
      <main className="flex flex-col gap-2">
        <MDXContent code={currentDoc!.mdx} components={MarkdownComponents} />

        <div className="flex flex-row justify-between items-center pt-4 border-t">
          {prevDoc ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                to={"/documentation/$slug"}
                params={{ slug: prevDoc.slug }}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {prevDoc.title}
              </Link>
            </Button>
          ) : (
            <div></div>
          )}

          {nextDoc ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                to={"/documentation/$slug"}
                params={{ slug: nextDoc.slug }}
                className="flex items-center gap-2"
              >
                {nextDoc.title}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </main>
    </DocumentationLayout>
  );
}
