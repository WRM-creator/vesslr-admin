import type { RoutingRuleDto } from "@/lib/api/generated";

/** "busha" -> "Busha". Provider names are admin-facing here, which is fine. */
export function formatProvider(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Compact corridor label for toasts/confirms: "NGN/NG" or "catch-all". */
export function matchLabel(rule: RoutingRuleDto): string {
  return (
    [rule.matchCurrency, rule.matchCountry, rule.matchRegion]
      .filter(Boolean)
      .join("/") || "catch-all"
  );
}
