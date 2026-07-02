import { api } from "@/lib/api";
import type { OrderResponseDto } from "@/lib/api/generated";
import { fromMinorUnit } from "@/lib/currency";
import { UNITS } from "@/types/unit";

/**
 * The resolved display form of a commodity differential price. A differential
 * order carries no scalar price until its benchmark resolves at escrow
 * funding; until then the formula `(Dated Brent + $2.00) / bbl` is how it
 * renders. Mirrors the user frontend's helper of the same name.
 */
export type DifferentialFormula = {
  isDifferential: boolean;
  /** "(Dated Brent + $2.00) / bbl", or null while benchmarks load. */
  formula: string | null;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  KES: "KSh",
  USD: "$",
  EUR: "€",
  USDT: "₮",
};

/** Read `benchmarkId` off a stored differential, whether raw id or populated. */
const readBenchmarkId = (benchmarkId: unknown): string =>
  benchmarkId && typeof benchmarkId === "object" && "_id" in benchmarkId
    ? (benchmarkId as { _id: string })._id
    : String(benchmarkId);

/**
 * Resolve an order's differential price into its display formula. Fetches the
 * benchmark list once (cached by React Query) to translate the benchmark id
 * into a name. Flat orders return `isDifferential: false`.
 */
export const useDifferentialFormula = (
  order?: Pick<
    OrderResponseDto,
    "pricingBasis" | "differentialPrice" | "currency" | "unitOfMeasurement"
  > | null,
): DifferentialFormula => {
  const isDifferential =
    order?.pricingBasis === "differential" && !!order?.differentialPrice;

  const { data: benchmarks = [] } = api.benchmarks.list.useQuery(
    {},
    { enabled: isDifferential },
  );

  if (!isDifferential || !order?.differentialPrice) {
    return { isDifferential: false, formula: null };
  }

  const diff = order.differentialPrice;
  const benchmarkId = readBenchmarkId(diff.benchmarkId);
  const benchmark = benchmarks.find((b) => b._id === benchmarkId);
  if (!benchmark?.name) return { isDifferential: true, formula: null };

  const unitLabel = UNITS[order.unitOfMeasurement]?.short ?? "unit";
  const symbol = CURRENCY_SYMBOLS[order.currency ?? ""] ?? "";
  const major = fromMinorUnit(diff.differentialValue, order.currency);
  const sign = major < 0 ? "−" : "+";
  const abs = Math.abs(major).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return {
    isDifferential: true,
    formula: `(${benchmark.name} ${sign} ${symbol}${abs}) / ${unitLabel}`,
  };
};
