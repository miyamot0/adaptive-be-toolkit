import { AdaptiveDemandContextProvider } from "#/components/context/adaptive-demand-context.tsx";
import { CommonTaskContextProvider } from "#/components/context/common-task-context.tsx";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import AdaptiveDemandPage from "#/components/pages/demand/adaptive-demand-page.tsx";
import { createMetaTags } from "#/lib/seo.ts";
import { mergedDemandParamsSchema } from "#/schema/demand/demand-params.ts";
import { demandSearchFlagSchema } from "#/schema/demand/demand-search.ts";
import type { DemandMethodology } from "#/types/demand/demand-methodology.ts";
import { AlgorithmThreshold } from "#/types/survey.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

const DEFAULT_PRICES = [
  ...Array.from({ length: 19 }, (_, i) => i * 0.25 + 1), // Generates [1, 1.25, 1.5, ..., 5]
  ...Array.from({ length: 40 }, (_, i) => i * 0.5 + 5), // Generates [5, 5.5, 6, ..., 25]
  ...Array.from({ length: 75 }, (_, i) => i * 1 + 25), // Generates [25, 26, 27, ..., 75]
];

export const Route = createFileRoute("/demand/$id/$method/")({
  head: () => ({
    ...createMetaTags({
      pageName: `Adaptive Demand Assessment`,
      content: "Adaptive Demand Assessment page",
    }),
  }),
  beforeLoad: async ({ params }) => {
    const validated = mergedDemandParamsSchema.safeParse(params);

    if (!validated.success) {
      throw redirect({
        to: "/",
        search: {
          error: "Invalid parameters for Adaptive Demand Assessment",
        },
      });
    }

    const { method } = validated.data;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (method !== "posm") {
      throw redirect({
        to: "/",
        search: {
          error: "Invalid method parameter for Adaptive Demand Assessment",
        },
      });
    }

    return {
      id: validated.data.id,
      method: method,
    };
  },
  validateSearch: (search: unknown) => {
    return demandSearchFlagSchema.parse(search);
  },
  loaderDeps: async ({ search }) => {
    try {
      const validatedSearch = demandSearchFlagSchema.parse(search);

      const algorithm =
        validatedSearch.algo &&
        Object.values(AlgorithmThreshold).includes(
          validatedSearch.algo as AlgorithmThreshold,
        )
          ? (validatedSearch.algo as AlgorithmThreshold)
          : AlgorithmThreshold.MaximumIteration;

      const compoundSuppression = validatedSearch.compound === true;

      const parsedPrices = validatedSearch.prices
        ? validatedSearch.prices
            .split(",")
            .map((p) => parseFloat(p.trim()))
            .filter((p) => !isNaN(p) && p > 0)
        : DEFAULT_PRICES;

      if (parsedPrices.length < 8) {
        throw new Error(
          'At least 8 valid price points must be provided in the "prices" search parameter, separated by commas. Example: prices=0.1,0.5,1,5,10',
        );
      }

      return {
        ShowFigures: validatedSearch.figures === "true" ? true : false,
        ShowDebug: validatedSearch.debug === "true" ? true : false,
        SRType: validatedSearch.reinforcer ?? "Example Reinforcers",
        Algorithm: algorithm,
        CompoundSuppression: compoundSuppression,
        Beta:
          validatedSearch.beta && !isNaN(parseFloat(validatedSearch.beta))
            ? parseFloat(validatedSearch.beta)
            : 0.5,
        Prices: parsedPrices,
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
            : 0.05,
      } satisfies DemandSearchParams;
    } catch (error) {
      throw redirect({
        to: "/",
        search: {
          error: "Invalid parameters for Adaptive Demand Assessment",
        },
      });
    }
  },
  loader: async ({ params, deps }) => {
    const {
      ShowFigures,
      ShowDebug,
      SRType,
      Algorithm,
      Beta,
      Prices,
      CompoundSuppression,
      MaxTrials,
      EntropyThreshold,
    } = await deps;

    try {
      const validated = mergedDemandParamsSchema.parse(params);

      return {
        ID: validated.id,
        Method: validated.method,
        SRType,
        ShowDebug,
        ShowFigures,
        Beta,
        Prices,
        Algorithm,
        CompoundSuppression,
        MaxTrials,
        EntropyThreshold,
      } satisfies DemandSettings;
    } catch (error) {
      throw redirect({
        to: "/",
        search: {
          error: "Invalid parameters for Adaptive Demand Assessment",
        },
      });
    }
  },
  component: RouteComponent,
});

type DemandSearchParams = {
  SRType: string;
  ShowDebug: boolean;
  ShowFigures: boolean;
  Algorithm: AlgorithmThreshold;
  Beta: number;
  Prices: number[];
  CompoundSuppression: boolean;
  MaxTrials: number;
  EntropyThreshold: number;
};

type DemandSettings = DemandSearchParams & {
  ID: string;
  Method: DemandMethodology;
};

function RouteComponent() {
  const {
    ID,
    Method,
    SRType,
    ShowDebug,
    ShowFigures,
    Algorithm,
    Beta,
    Prices,
    CompoundSuppression,
    MaxTrials,
  } = Route.useLoaderData();

  switch (Method) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case "posm":
      return (
        <CommonTaskContextProvider>
          <AdaptiveDemandContextProvider>
            <PageWrapper>
              <AdaptiveDemandPage
                ID={ID}
                Reinforcer={SRType}
                RenderFigures={ShowFigures}
                DebugOutput={ShowDebug}
                Algorithm={Algorithm}
                Beta={Beta}
                Prices={Prices}
                CompoundSuppression={CompoundSuppression}
                MaxTrials={MaxTrials}
              />
            </PageWrapper>
          </AdaptiveDemandContextProvider>
        </CommonTaskContextProvider>
      );
    default:
      throw redirect({
        to: "/",
        search: {
          error: "Invalid method parameter for Adaptive Demand Assessment",
        },
      });
  }
}
