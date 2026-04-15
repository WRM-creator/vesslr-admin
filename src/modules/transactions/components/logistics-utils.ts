export function formatShippingMethod(method?: string) {
  if (!method) return "Unknown";
  return method
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}
