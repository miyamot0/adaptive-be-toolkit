import { getPrimary, getSecondary } from "#/components/figures/axes.ts";
import { useMemo } from "react";
import { Chart } from "react-charts";
import type { SeriesRawDataMapping } from "#/components/figures/axes.ts";

type Props = {
  seriesData: SeriesRawDataMapping;
};

export default function ChartRawChoice({ seriesData }: Props) {
  const primaryAxis = useMemo(
    () => getPrimary(1, seriesData.data.length, "log")(),
    [seriesData.data.length],
  );
  const secondaryAxes = useMemo(() => [getSecondary("bubble")()], []);

  return (
    <div className="bg-white">
      {seriesData.data.length > 0 && (
        <div className="w-full h-100 flex flex-col">
          <h2
            style={{
              textAlign: "center",
              margin: "10px 0",
              fontFamily: "sans-serif",
            }}
          >
            {seriesData.label}
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
