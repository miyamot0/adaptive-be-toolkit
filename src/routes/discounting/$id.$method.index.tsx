import { AdaptiveDiscountingContextProvider } from '#/components/context/adaptive-discounting-context.tsx';
import { CommonTaskContextProvider } from '#/components/context/common-task-context.tsx';
import PageWrapper from '#/components/layout/page-wrapper.tsx';
import AdaptiveDiscountingPage from '#/components/pages/discounting/adaptive-discounting-page.tsx';
import { discountingSearchFlagSchema, mergedDiscountingParamsSchema, type DiscountingSearchFlags } from '#/schema/discounting.ts';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/discounting/$id/$method/')({
    validateSearch: (search: unknown & DiscountingSearchFlags) => {
        return discountingSearchFlagSchema.parse(search);
    },
    loaderDeps: async ({ search }) => {
        try {
            const validatedSearch = discountingSearchFlagSchema.parse(search);

            return {
                ShowFigures: validatedSearch.figures === 'true' ? true : false,
                ShowDebug: validatedSearch.debug === 'true' ? true : false,
                SRType: validatedSearch.reinforcer ?? 'Dollars',
                SSR: validatedSearch.ssr && !isNaN(parseInt(validatedSearch.ssr)) ? parseInt(validatedSearch.ssr) : 50,
                LLR: validatedSearch.llr && !isNaN(parseInt(validatedSearch.llr)) ? parseInt(validatedSearch.llr) : 100,
            } satisfies DiscountingSearchParams;
        } catch (error) {
            throw redirect({ to: '/', search: { error: 'Invalid id parameter for Adaptive Discounting Assessment' } });
        }
    },
    loader: async ({ params, deps }) => {
        const { ShowFigures, ShowDebug, SRType, SSR, LLR } = await deps;

        try {
            const validated = mergedDiscountingParamsSchema.parse(params);

            return {
                ID: validated.id,
                Method: validated.method,
                SSR,
                LLR,
                SRType,
                ShowDebug,
                ShowFigures,
            } satisfies DiscountingSettings;

        } catch (error) {
            throw redirect({ to: '/', search: { error: 'Invalid parameters for Adaptive Discounting Assessment' } });
        }
    },
    component: RouteComponent,
})

type DiscountingSearchParams = {
    SSR: number;
    LLR: number;
    SRType: string;
    ShowDebug: boolean;
    ShowFigures: boolean;
}

type DiscountingSettings = DiscountingSearchParams & {
    ID: string;
    Method: string;
}

function RouteComponent() {
    const { ID, Method, SSR, LLR, SRType, ShowDebug, ShowFigures } = Route.useLoaderData();

    return <CommonTaskContextProvider>
        <AdaptiveDiscountingContextProvider>
            <PageWrapper>
                <AdaptiveDiscountingPage ID={ID} Reinforcer={SRType} RenderFigures={ShowFigures} DebugOutput={ShowDebug} SSR={SSR} LLR={LLR} />
            </PageWrapper>
        </AdaptiveDiscountingContextProvider>
    </CommonTaskContextProvider>;
}
