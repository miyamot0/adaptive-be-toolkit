import DocumentationHome from "#/components/pages/documentation/documentation-home.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/documentation2/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DocumentationHome />;
}
