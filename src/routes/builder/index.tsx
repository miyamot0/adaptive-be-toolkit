import LinkBuilderPage from "#/components/pages/builder/link-builder-page.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/builder/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LinkBuilderPage />;
}
