import { api } from "@/lib/api";
import {
  computeDelta,
  type SparkDelta,
  type SparkPoint,
  type SparkSeries,
} from "@/lib/sparklines";
import type { DashboardTrendsDto } from "@/lib/api/generated";
import { useMemo } from "react";

export interface AdminDashboardSparklines {
  feeRevenue: SparkSeries;
  transactionVolume: SparkSeries;
  newOrganizations: SparkSeries;
  activeTransactions: SparkSeries;
  completedTransactions: SparkSeries;
}

const EMPTY: SparkPoint[] = [];
const FLAT_DELTA: SparkDelta = { value: 0, direction: "flat" };

export function useAdminDashboardSparklines(): AdminDashboardSparklines {
  const { data, isLoading } = api.admin.dashboard.trends.useQuery({});
  const trends = data?.data as DashboardTrendsDto | undefined;

  return useMemo(() => {
    const build = (
      series: Array<{ date: string; value: number }> | undefined,
    ): SparkSeries => {
      if (!series || series.length === 0) {
        return { series: EMPTY, delta: FLAT_DELTA, isLoading };
      }
      const points: SparkPoint[] = series.map((p) => ({
        date: p.date,
        value: p.value,
      }));
      return {
        series: points,
        delta: computeDelta(points, "flow"),
        isLoading,
      };
    };

    return {
      feeRevenue: build(trends?.feeRevenue),
      transactionVolume: build(trends?.transactionVolume),
      newOrganizations: build(trends?.newOrganizations),
      activeTransactions: build(trends?.activeTransactions),
      completedTransactions: build(trends?.completedTransactions),
    };
  }, [trends, isLoading]);
}
