import LinkBuilderPage from "#/components/pages/builder/link-builder-page.tsx";
import { createMetaTags } from "#/lib/seo.ts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/builder/")({
  head: () => ({
    ...createMetaTags({
      pageName: "Adaptive BE Toolkit Link Builder",
      content:
        "The Link Builder is a user-friendly interface within the Adaptive BE Toolkit that allows researchers to easily create and customize links for administering adaptive behavioral economics measures in online research studies.",
    }),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <LinkBuilderPage />;
}
