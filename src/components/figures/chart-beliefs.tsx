import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { getPrimary, getSecondary } from "#/components/figures/axes.ts";
import type { SeriesRawDataMapping } from "#/components/figures/axes.ts";
import { use, useMemo } from "react";
import { Chart } from "react-charts";
import { AdaptiveDemandContext } from "../context/adaptive-demand-context";

type Props = {
  seriesData: SeriesRawDataMapping;
};

export function ChartDiscountingBeliefs({ seriesData }: Props) {
  const { POSM } = use(AdaptiveDiscountingContext);

  const maxDelay = Math.max(...POSM.levels);

  const primaryAxis = useMemo(() => getPrimary(1, maxDelay, "log")(), []);
  const secondaryAxes = useMemo(() => [getSecondary()()], []);

  return (
    <div className="bg-white">
      {POSM.responses.length >= 0 && (
        <div className="w-full h-100 flex flex-col">
          <h2
            style={{
              textAlign: "center",
              margin: "10px 0",
              fontFamily: "sans-serif",
            }}
          >
            Belief Distribution
          </h2>
          <div className="grow flex-1 relative">
            <Chart
              className="tick-color"
              options={{
                data: [seriesData],
                primaryAxis,
                secondaryAxes,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ChartDemandBeliefs({ seriesData }: Props) {
  const { POSM } = use(AdaptiveDemandContext);

  const maxDelay = Math.max(...POSM.levels);

  const primaryAxis = useMemo(() => getPrimary(1, maxDelay, "log")(), []);
  const secondaryAxes = useMemo(() => [getSecondary()()], []);

  return (
    <div className="bg-white">
      {POSM.responses.length >= 0 && (
        <div className="w-full h-100 flex flex-col">
          <h2
            style={{
              textAlign: "center",
              margin: "10px 0",
              fontFamily: "sans-serif",
            }}
          >
            Belief Distribution
          </h2>
          <div className="grow flex-1 relative">
            <Chart
              className="tick-color"
              options={{
                data: [seriesData],
                primaryAxis,
                secondaryAxes,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
