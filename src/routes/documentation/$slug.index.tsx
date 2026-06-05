import PageWrapper from "#/components/layout/page-wrapper.tsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import { allDocumentations } from "content-collections";
import type { Documentation } from "content-collections";
import { MarkdownComponents } from "#/components/markdown/markdown-components.tsx";
import { MDXContent } from "@content-collections/mdx/react";
import { Button } from "#/components/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createMetaTags } from "#/lib/seo.ts";

export const Route = createFileRoute("/documentation/$slug/")({
  beforeLoad: async ({ params }) => {
    const doc = allDocumentations.find((doc) => doc.slug === params.slug);

    if (!doc) {
      throw new Response("Not Found", { status: 404 });
    }

    return { params };
  },
  loader: async ({ params }) => {
    const currentDoc: Documentation | undefined = allDocumentations.find(
      (doc) => doc.slug === params.slug,
    );

    if (!currentDoc) {
      throw new Response("Not Found", { status: 404 });
    }

    const nextDoc: Documentation | undefined = allDocumentations.find(
      (doc) => doc.index === currentDoc.index + 1,
    );
    const prevDoc: Documentation | undefined = allDocumentations.find(
      (doc) => doc.index === currentDoc.index - 1,
    );

    return { currentDoc, nextDoc, prevDoc };
  },
  component: RouteComponent,
  head: ({ loaderData }) => ({
    ...createMetaTags({
      pageName: loaderData!.currentDoc.title,
      content: loaderData!.currentDoc.summary,
    }),
  }),
});

function RouteComponent() {
  const { currentDoc, nextDoc, prevDoc } = Route.useLoaderData();

  return (
    <PageWrapper ShowHeader={true} ShowFooter={true}>
      <main className="flex flex-col gap-2">
        <MDXContent code={currentDoc.mdx} components={MarkdownComponents} />

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
    </PageWrapper>
  );
}
