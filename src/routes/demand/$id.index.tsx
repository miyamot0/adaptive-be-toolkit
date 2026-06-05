import { AdaptiveDemandContextProvider } from "#/components/context/adaptive-demand-context.tsx";
import { CommonTaskContextProvider } from "#/components/context/common-task-context.tsx";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import AdaptiveDemandPage from "#/components/pages/demand/adaptive-demand-page.tsx";
import { mergedDemandParamsSchema } from "#/schema/demand/demand-params.ts";
import { demandSearchFlagSchema } from "#/schema/demand/demand-search.ts";
import type { DemandSearchFlags } from "#/schema/demand/demand-search.ts";
import { AlgorithmThreshold } from "#/types/survey.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

const DEFAULT_PRICES = [
  ...[0.1, 0.25, 0.5, 0.75],
  ...Array.from({ length: 19 }, (_, i) => i * 0.5 + 1), // Generates [1, 1.5, 2, ..., 10]
  ...Array.from({ length: 40 }, (_, i) => i * 1 + 11), // Generates [11, 12, 13, ..., 50]
];

export const Route = createFileRoute("/demand/$id/")({
  validateSearch: (search: unknown & DemandSearchFlags) => {
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
    } = await deps;

    try {
      const validated = mergedDemandParamsSchema.parse(params);

      return {
        ID: validated.id,
        SRType,
        ShowDebug,
        ShowFigures,
        Beta,
        Prices,
        Algorithm,
        CompoundSuppression,
        MaxTrials,
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
};

type DemandSettings = DemandSearchParams & {
  ID: string;
};

function RouteComponent() {
  const {
    ID,
    SRType,
    ShowDebug,
    ShowFigures,
    Algorithm,
    Beta,
    Prices,
    CompoundSuppression,
    MaxTrials,
  } = Route.useLoaderData();

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
}
