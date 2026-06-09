import { createFileRoute } from "@tanstack/react-router";
import { createMetaTags } from "#/lib/seo.ts";
import DocumentationHome from "#/components/pages/documentation/documentation-home.tsx";

export const Route = createFileRoute("/documentation/")({
  component: RouteComponent,
  head: () => ({
    ...createMetaTags({
      pageName: "Documentation",
      content: "Comprehensive documentation for the Adaptive BE Toolkit.",
    }),
  }),
});

function RouteComponent() {
  return <DocumentationHome />;
}
