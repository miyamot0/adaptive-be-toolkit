import type { AxisOptions } from "react-charts";

export type RawDataMapping = {
  x: number;
  y: number;
};

export type SeriesRawDataMapping = {
  label: string;
  data: RawDataMapping[];
};

export function getPrimary(
  min: number,
  max: number,
  scaleType: "linear" | "log" = "linear",
): () => AxisOptions<RawDataMapping> {
  return () => ({
    getValue: (datum) => datum.x,
    styles: {
      tick: {
        fontSize: "12px",
        fill: "#333",
        fontWeight: "bold",
      },
    },
    scaleType,
    min,
    max,
  });
}

export function getSecondary(
  elementType: "line" | "bar" | "bubble" = "line",
): () => AxisOptions<RawDataMapping> {
  return () => ({
    getValue: (datum) => datum.y,
    styles: {
      tick: {
        fontSize: "12px",
        fill: "#333",
        fontWeight: "bold",
      },
    },
    elementType,
    min: 0,
  });
}
