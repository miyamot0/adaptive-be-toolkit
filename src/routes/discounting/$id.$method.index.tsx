import { AdaptiveDiscountingContextProvider } from '#/components/context/adaptive-discounting-context.tsx';
import { CommonTaskContextProvider } from '#/components/context/common-task-context.tsx';
import PageWrapper from '#/components/layout/page-wrapper.tsx';
import AdaptiveDiscountingPage from '#/components/pages/discounting/adaptive-discounting-page.tsx';
import { discountingSearchFlagSchema, mergedDiscountingParamsSchema, type DiscountingSearchFlags } from '#/schema/discounting.ts';
import { AlgorithmThreshold } from '#/types/survey.ts';
import { createFileRoute, redirect } from '@tanstack/react-router'

const DEFAULT_DELAYS = [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        60, 90, 120, 150, 180,
        210, 240, 270, 300, 330, 360],
    ...Array.from({ length: 11 * 2 }, (_, i) => i * 30 + 390), // Generates [390, 420, 450, ..., 720]
    ...Array.from({ length: 8 * 2 }, (_, i) => i * 90 + 750), // Generates [750, 840, 930, ..., 1380]
];

export const Route = createFileRoute('/discounting/$id/$method/')({
    validateSearch: (search: unknown & DiscountingSearchFlags) => {
        return discountingSearchFlagSchema.parse(search);
    },
    loaderDeps: async ({ search }) => {
        try {
            const validatedSearch = discountingSearchFlagSchema.parse(search);

            const algorithm = validatedSearch.algo && Object.values(AlgorithmThreshold).includes(validatedSearch.algo as AlgorithmThreshold) ? validatedSearch.algo as AlgorithmThreshold
                : AlgorithmThreshold.RegretMin;

            const parsedDelays = validatedSearch.delays ? validatedSearch.delays.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d)) : DEFAULT_DELAYS;

            if (parsedDelays.length < 8) {
                throw new Error('At least 8 valid delay points must be provided in the "delays" search parameter, separated by commas. Example: delays=1,30,180');
            }

            return {
                ShowFigures: validatedSearch.figures === 'true' ? true : false,
                ShowDebug: validatedSearch.debug === 'true' ? true : false,
                SRType: validatedSearch.reinforcer ?? 'Dollars',
                SSR: validatedSearch.ssr && !isNaN(parseInt(validatedSearch.ssr)) ? parseInt(validatedSearch.ssr) : 50,
                LLR: validatedSearch.llr && !isNaN(parseInt(validatedSearch.llr)) ? parseInt(validatedSearch.llr) : 100,
                Algorithm: algorithm,
                Beta: validatedSearch.beta && !isNaN(parseFloat(validatedSearch.beta)) ? parseFloat(validatedSearch.beta) : 0.25,
                Delays: parsedDelays,
            } satisfies DiscountingSearchParams;
        } catch (error) {
            throw redirect({ to: '/', search: { error: 'Invalid id parameter for Adaptive Discounting Assessment' } });
        }
    },
    loader: async ({ params, deps }) => {
        const { ShowFigures, ShowDebug, SRType, SSR, LLR, Algorithm, Beta, Delays } = await deps;

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
                Beta,
                Delays,
                Algorithm,
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
    Algorithm: AlgorithmThreshold;
    Beta: number;
    Delays: number[];
}

type DiscountingSettings = DiscountingSearchParams & {
    ID: string;
    Method: string;
}

function RouteComponent() {
    const { ID, Method, SSR, LLR, SRType, ShowDebug, ShowFigures, Algorithm, Beta, Delays } = Route.useLoaderData();

    // TODO: Delay points
    // TODO: Beta


    return <CommonTaskContextProvider>
        <AdaptiveDiscountingContextProvider>
            <PageWrapper>
                <AdaptiveDiscountingPage ID={ID} Reinforcer={SRType} RenderFigures={ShowFigures} DebugOutput={ShowDebug} SSR={SSR} LLR={LLR} Algorithm={Algorithm} Beta={Beta} Delays={Delays} />
            </PageWrapper>
        </AdaptiveDiscountingContextProvider>
    </CommonTaskContextProvider>;
}
