import PageWrapper from '#/components/layout/page-wrapper.tsx';
import { createFileRoute } from '@tanstack/react-router';
import { allDocumentations, type Documentation } from "content-collections";
import { MarkdownComponents } from '#/components/markdown/markdown-components.tsx';
import { MDXContent } from '@content-collections/mdx/react';
import { Button } from '#/components/ui/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/documentation/$slug/')({
    beforeLoad: async ({ params }) => {
        const doc = allDocumentations.find((doc) => doc.slug === params.slug);

        if (!doc) {
            throw new Response('Not Found', { status: 404 });
        }

        return { params }
    },
    loader: async ({ params }) => {
        const currentDoc: Documentation | undefined = allDocumentations.find((doc) => doc.slug === params.slug);

        if (!currentDoc) {
            throw new Response('Not Found', { status: 404 });
        }

        const nextDoc: Documentation | undefined = allDocumentations.find((doc) => doc.index === currentDoc.index + 1);
        const prevDoc: Documentation | undefined = allDocumentations.find((doc) => doc.index === currentDoc.index - 1);

        return { currentDoc, nextDoc, prevDoc };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { currentDoc, nextDoc, prevDoc } = Route.useLoaderData();

    return (
        <PageWrapper ShowHeader={true} ShowFooter={true}>
            <main className="flex flex-col gap-2">
                <MDXContent
                    // @ts-expect-error
                    code={currentDoc.mdx}
                    components={MarkdownComponents}
                />

                <div className="flex flex-row justify-between items-center pt-4 border-t">
                    <Button disabled={!prevDoc} asChild variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                        Previous Entry
                    </Button>

                    <Button disabled={!nextDoc} asChild variant="outline" size="sm">
                        Next Entry
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </main>
        </PageWrapper>
    );
}
