import AdaptiveDemandPage from '#/components/pages/demand/adaptive-demand-page.tsx';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod';

const idParseSchema = z.object({
    id: z.string().min(6, { message: 'id parameter is required' }),
});

const flagsParseSchema = z.object({
    figures: z.string().optional(),
    debug: z.string().optional(),
})

export const Route = createFileRoute('/$id/adaptive/')({
    validateSearch: (search) => flagsParseSchema.parse(search),
    beforeLoad: async ({ params }) => {
        try {
            const validated = idParseSchema.parse(params);
            return {
                params: validated,
            }
        } catch (error) {
            throw redirect({ to: '/', search: { error: 'Invalid id parameter for Adaptive Demand Assessment' } });
        }
    },
    loader: async ({ params }) => {
        return {
            ...params
        };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams();
    const { figures, debug } = Route.useSearch();

    return <AdaptiveDemandPage ID={id} Reinforcer="Sample Reinforcer" RenderFigures={figures !== undefined} />;
}
