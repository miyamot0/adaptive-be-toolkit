/** ChartEntropy
 *
 * Visualizes per-trial belief entropy (nats) across the discounting task.
 * A downward slope indicates beliefs are concentrating around the ED50 estimate;
 * a plateau signals convergence and that additional trials are unlikely to
 * contribute new information. Maximum entropy for N levels is ln(N);
 * minimum is 0 (complete certainty about a single level).
 */
import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { getPrimary, getSecondary } from "#/components/figures/axes.ts";
import { use, useMemo } from "react";
import { Chart } from "react-charts";
import type { SeriesRawDataMapping } from "#/components/figures/axes.ts";

type Props = {
  seriesData: SeriesRawDataMapping;
};

export default function ChartEntropy({ seriesData }: Props) {
  const { POSM } = use(AdaptiveDiscountingContext);

  const primaryAxis = useMemo(
    () => getPrimary(1, POSM.responses.length, "log")(),
    [],
  );
  const secondaryAxes = useMemo(() => [getSecondary(undefined)()], []);

  return (
    <div className="bg-white">
      {POSM.responses.length > 0 && (
        <div className="w-full h-100 flex flex-col">
          <h2
            style={{
              textAlign: "center",
              margin: "10px 0",
              fontFamily: "sans-serif",
            }}
          >
            Belief Entropy
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
