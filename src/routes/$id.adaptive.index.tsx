import { AdaptiveDemandContextProvider } from '#/components/context/adaptive-demand-context.tsx';
import AdaptiveDemandPage from '#/components/pages/demand/adaptive-demand-page.tsx';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod';

const idParseSchema = z.object({
    id: z.string().min(6, { message: 'id parameter is required' }),
});

const flagsParseSchema = z.object({
    figures: z.string().optional(),
    debug: z.string().optional(),
    reinforcer: z.string().optional(),
})

type FlagsSearch = z.infer<typeof flagsParseSchema>;

export const Route = createFileRoute('/$id/adaptive/')({
    validateSearch: (search: unknown & FlagsSearch) => flagsParseSchema.parse(search),
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
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams();
    const { figures, debug, reinforcer } = Route.useSearch();

    const srClean = reinforcer ?? 'Example Reinforcers';

    return <AdaptiveDemandContextProvider>
        <AdaptiveDemandPage ID={id} Reinforcer={srClean} RenderFigures={figures === 'true'} DebugOutput={debug === 'true'} />
    </AdaptiveDemandContextProvider>;
}
