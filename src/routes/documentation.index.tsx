import PageWrapper from '#/components/layout/page-wrapper.tsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/components/ui/card.tsx';
import { createFileRoute, Link } from '@tanstack/react-router'
import { allDocumentations } from "content-collections";
import { BookIcon } from 'lucide-react';

export const Route = createFileRoute('/documentation/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PageWrapper ShowHeader={true} ShowFooter={true}>
        <main className="flex flex-col gap-2">
            <h1>Toolkit Documentation</h1>

            <section className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {allDocumentations.sort((a, b) => a.index - b.index).map((doc) => (
                    <Card key={doc._meta.fileName} className="flex">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col grow">
                            <p className="text-sm text-muted-foreground">{doc.summary}</p>

                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Link to={`/documentation/$title`}
                                params={{ title: doc._meta.fileName.replace(/\.mdx$/, '') }}
                                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                                <BookIcon className="h-4 w-4" />
                                Read
                            </Link>
                        </CardFooter>


                    </Card>
                ))}
            </section>
        </main>
    </PageWrapper>
}
