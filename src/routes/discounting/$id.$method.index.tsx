import { AdaptiveDiscountingContextProvider } from "#/components/context/adaptive-discounting-context.tsx";
import { CommonTaskContextProvider } from "#/components/context/common-task-context.tsx";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import AdaptiveDiscountingPage from "#/components/pages/discounting/adaptive-discounting-page.tsx";
import { createMetaTags } from "#/lib/seo.ts";
import { mergedDiscountingParamsSchema } from "#/schema/discounting/discounting-params.ts";
import { discountingSearchFlagSchema } from "#/schema/discounting/discounting-search.ts";
import type { DiscountingSearchFlags } from "#/schema/discounting/discounting-search.ts";
import type { DiscountingMethodology } from "#/types/discounting/discounting-methodology.ts";
import { AlgorithmThreshold } from "#/types/survey.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

const DEFAULT_DELAYS = [
  // TODO: 1-365
  ...Array.from({ length: 365 }, (_, i) => i + 1), // Generates [1, 2, ..., 365]
  // TODO: Weekly from 356 to 3 years
  ...Array.from({ length: 52 * 3 }, (_, i) => (i + 1) * 7 + 365), // Generates [372, 379, ..., 1460]
  // TODO: Monthly from 3 years to 5 years
  ...Array.from({ length: 24 }, (_, i) => (i + 1) * 30 + 365 * 3), // Generates [1555, 1585, ..., 2365]
  // TODO: Yearly from 5 years to 20 years
  ...Array.from({ length: 15 }, (_, i) => (i + 1) * 365 + 365 * 5), // Generates [2920, 3285, ..., 7300]
];

export const Route = createFileRoute("/discounting/$id/$method/")({
  head: () => ({
    ...createMetaTags({
      pageName: `Adaptive Discounting Assessment`,
      content: "Adaptive Discounting Assessment page",
    }),
  }),
  validateSearch: (search: unknown & DiscountingSearchFlags) => {
    return discountingSearchFlagSchema.parse(search);
  },
  loaderDeps: async ({ search }) => {
    try {
      const validatedSearch = discountingSearchFlagSchema.parse(search);

      const algorithm =
        validatedSearch.algo &&
        Object.values(AlgorithmThreshold).includes(
          validatedSearch.algo as AlgorithmThreshold,
        )
          ? (validatedSearch.algo as AlgorithmThreshold)
          : AlgorithmThreshold.RegretMin;

      const compoundSuppression = validatedSearch.compound === true;

      const parsedDelays = validatedSearch.delays
        ? validatedSearch.delays
            .split(",")
            .map((d) => parseInt(d.trim()))
            .filter((d) => !isNaN(d))
        : DEFAULT_DELAYS;

      if (parsedDelays.length < 8) {
        throw new Error(
          'At least 8 valid delay points must be provided in the "delays" search parameter, separated by commas. Example: delays=1,30,180',
        );
      }

      return {
        ShowFigures: validatedSearch.figures === "true" ? true : false,
        ShowDebug: validatedSearch.debug === "true" ? true : false,
        SRType: validatedSearch.reinforcer ?? "Dollars",
        SSR:
          validatedSearch.ssr && !isNaN(parseInt(validatedSearch.ssr))
            ? parseInt(validatedSearch.ssr)
            : 50,
        LLR:
          validatedSearch.llr && !isNaN(parseInt(validatedSearch.llr))
            ? parseInt(validatedSearch.llr)
            : 100,
        Algorithm: algorithm,
        CompoundSuppression: compoundSuppression,
        Beta:
          validatedSearch.beta && !isNaN(parseFloat(validatedSearch.beta))
            ? parseFloat(validatedSearch.beta)
            : 0.25,
        Delays: parsedDelays,
        MaxTrials:
          validatedSearch.maxTrials &&
          !isNaN(parseInt(validatedSearch.maxTrials))
            ? Math.max(4, parseInt(validatedSearch.maxTrials))
            : 20,
        EntropyThreshold:
          validatedSearch.entropyThreshold &&
          !isNaN(parseFloat(validatedSearch.entropyThreshold))
            ? Math.min(
                0.5,
                Math.max(0, parseFloat(validatedSearch.entropyThreshold)),
              )
            : 0.25,
      } satisfies DiscountingSearchParams;
    } catch (error) {
      throw redirect({
        to: "/",
        search: {
          error: "Invalid id parameter for Adaptive Discounting Assessment",
        },
      });
    }
  },
  loader: async ({ params, deps }) => {
    const {
      ShowFigures,
      ShowDebug,
      SRType,
      SSR,
      LLR,
      Algorithm,
      Beta,
      Delays,
      CompoundSuppression,
      MaxTrials,
      EntropyThreshold,
    } = await deps;

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
        CompoundSuppression,
        MaxTrials,
        EntropyThreshold,
      } satisfies DiscountingSettings;
    } catch (error) {
      throw redirect({
        to: "/",
        search: {
          error: "Invalid parameters for Adaptive Discounting Assessment",
        },
      });
    }
  },
  component: RouteComponent,
});

type DiscountingSearchParams = {
  SSR: number;
  LLR: number;
  SRType: string;
  ShowDebug: boolean;
  ShowFigures: boolean;
  Algorithm: AlgorithmThreshold;
  Beta: number;
  Delays: number[];
  CompoundSuppression: boolean;
  MaxTrials: number;
  EntropyThreshold: number;
};

type DiscountingSettings = DiscountingSearchParams & {
  ID: string;
  Method: DiscountingMethodology;
};

function RouteComponent() {
  const {
    ID,
    Method,
    SSR,
    LLR,
    SRType,
    ShowDebug,
    ShowFigures,
    Algorithm,
    Beta,
    Delays,
    CompoundSuppression,
    MaxTrials,
  } = Route.useLoaderData();

  switch (Method) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case "posm":
      return (
        <CommonTaskContextProvider>
          <AdaptiveDiscountingContextProvider>
            <PageWrapper>
              <AdaptiveDiscountingPage
                ID={ID}
                Reinforcer={SRType}
                RenderFigures={ShowFigures}
                DebugOutput={ShowDebug}
                SSR={SSR}
                LLR={LLR}
                Algorithm={Algorithm}
                Beta={Beta}
                Delays={Delays}
                CompoundSuppression={CompoundSuppression}
                MaxTrials={MaxTrials}
              />
            </PageWrapper>
          </AdaptiveDiscountingContextProvider>
        </CommonTaskContextProvider>
      );
    default:
      throw redirect({
        to: "/",
        search: {
          error: "Invalid method parameter for Adaptive Discounting Assessment",
        },
      });
  }
}
