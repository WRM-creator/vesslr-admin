import type { ProductResponseDto } from "@/lib/api/generated";

/**
 * Whether a listing carries anything the commodity wizard declares. Older
 * listings created before the wizard have none, and show no commodity card.
 */
export const hasCommodityTerms = (product: ProductResponseDto) =>
  !!(
    product.contractStyle ||
    product.availability ||
    product.paymentTerms ||
    product.tolerancePercent != null ||
    product.shippingRegions?.length ||
    product.loadingTerminal?.name ||
    product.laycan?.start ||
    product.listingExpiresAt ||
    product.tradeDocuments?.length ||
    product.specDeclarations?.length
  );
