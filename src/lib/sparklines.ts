/**
 * Shared sparkline primitives used by dashboard metric cards.
 */

export type SparkPoint = { date: string; value: number };

export type SparkDelta = {
  value: number;
  direction: "up" | "down" | "flat";
};

export interface SparkSeries {
  series: SparkPoint[];
  delta: SparkDelta;
  isLoading: boolean;
}

/**
 * Computes a percentage change between two windows of a series.
 *
 * - "flow" mode: compares sum of last 7 days vs previous 7 days
 * - "level" mode: compares latest point vs point 7 days ago
 */
export const computeDelta = (
  series: SparkPoint[],
  mode: "flow" | "level" = "flow",
): SparkDelta => {
  if (series.length === 0) return { value: 0, direction: "flat" };

  if (mode === "level") {
    const latest = series[series.length - 1]?.value ?? 0;
    const reference = series[Math.max(0, series.length - 8)]?.value ?? 0;
    if (reference === 0) {
      return { value: 0, direction: latest > 0 ? "up" : "flat" };
    }
    const pct = ((latest - reference) / reference) * 100;
    return {
      value: Math.round(pct * 10) / 10,
      direction: pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat",
    };
  }

  const last7 = series.slice(-7).reduce((acc, p) => acc + p.value, 0);
  const prev7 = series.slice(-14, -7).reduce((acc, p) => acc + p.value, 0);
  if (prev7 === 0) {
    return { value: 0, direction: last7 > 0 ? "up" : "flat" };
  }
  const pct = ((last7 - prev7) / prev7) * 100;
  return {
    value: Math.round(pct * 10) / 10,
    direction: pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat",
  };
};
