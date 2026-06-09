import HomePage from "#/components/pages/home/home-page.tsx";
import { createMetaTags } from "#/lib/seo.ts";
import { errorSearchSchema } from "#/schema/common.ts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    ...createMetaTags({
      pageName: "Home",
      content:
        "The Adaptive BE Toolkit is a self-contained, iframe-embeddable web application for administering adaptive behavioral economics measures in online research studies.",
    }),
  }),
  validateSearch: (search) => errorSearchSchema.parse(search),
  component: App,
});

function App() {
  const { error } = Route.useSearch();

  return <HomePage ShowHeader={true} ShowFooter={true} error={error} />;
}
