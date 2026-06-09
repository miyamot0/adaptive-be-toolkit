import { DocumentationLayout } from "./documentation-layout.tsx";

export default function DocumentationHome() {
  return (
    <DocumentationLayout tocItems={[]}>
      <main className="flex flex-col gap-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Documentation
          </h1>

          <p className="text-muted-foreground">
            Browse the documentation on the left. Select a page to view its
            contents.
          </p>
        </div>
      </main>
    </DocumentationLayout>
  );
}
