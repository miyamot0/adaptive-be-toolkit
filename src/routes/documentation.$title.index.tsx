import PageWrapper from '#/components/layout/page-wrapper.tsx';
import { createFileRoute } from '@tanstack/react-router';
import { allDocumentations } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";

export const Route = createFileRoute('/documentation/$title/')({
    loader: async ({ params }) => {
        const doc = allDocumentations.find((doc) => doc._meta.fileName.startsWith(params.title));

        if (!doc) {
            throw new Response('Not Found', { status: 404 });
        }
        return { doc };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { doc } = Route.useLoaderData();

    return (
        <PageWrapper ShowHeader={true} ShowFooter={true}>
            <main className="flex flex-col gap-2">
                <MDXContent
                    code={doc.mdx}
                    components={{
                        h1: (props) => (
                            // @ts-ignore
                            <h1 className="text-3xl font-bold mb-4" {...props} />
                        ),
                    }}
                />
            </main>
        </PageWrapper>
    );
}
