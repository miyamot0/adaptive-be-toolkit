import { AdaptiveDiscountingContextProvider } from '#/components/context/adaptive-discounting-context.tsx';
import { CommonTaskContextProvider } from '#/components/context/common-task-context.tsx';
import PageWrapper from '#/components/layout/page-wrapper.tsx';
import AdaptiveDiscountingPage from '#/components/pages/discounting/adaptive-discounting-page.tsx';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod';

const idParseSchema = z.object({
    id: z.string().min(6, { message: 'id parameter is required' }),
});

const flagsParseSchema = z.object({
    figures: z.string().optional(),
    debug: z.string().optional(),
    reinforcer: z.string().optional(),
    ssr: z.string().optional(),
    llr: z.string().optional(),
})

type FlagsSearch = z.infer<typeof flagsParseSchema>;

export const Route = createFileRoute('/discounting/$id/')({
    validateSearch: (search: unknown & FlagsSearch) => flagsParseSchema.parse(search),
    beforeLoad: async ({ params, search }) => {
        try {
            const validated = idParseSchema.parse(params);
            const validatedSearch = flagsParseSchema.parse(search);

            return {
                params: validated,
                search: validatedSearch,
            }
        } catch (error) {
            throw redirect({ to: '/', search: { error: 'Invalid id parameter for Adaptive Discounting Assessment' } });
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams();
    const { figures, debug, reinforcer, ssr, llr } = Route.useSearch();

    const SSR = ssr ? parseInt(ssr) : 50;
    const LLR = llr ? parseInt(llr) : 100;

    const srClean = reinforcer ?? 'Dollars';

    return <CommonTaskContextProvider>
        <AdaptiveDiscountingContextProvider>
            <PageWrapper>
                <AdaptiveDiscountingPage ID={id} Reinforcer={srClean} RenderFigures={figures === 'true'} DebugOutput={debug === 'true'} SSR={SSR} LLR={LLR} />
            </PageWrapper>
        </AdaptiveDiscountingContextProvider>
    </CommonTaskContextProvider>;
}
