import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TINT } from "@/lib/tint";
import type {
  AdminBankDetailsDto,
  AdminCryptoPayoutDetailsDto,
} from "@/lib/api/generated";
import { CheckCircleIcon, CreditCardIcon, WalletIcon } from "lucide-react";

interface PayoutDestinationsProps {
  bankDetails: AdminBankDetailsDto | null;
  cryptoPayoutDetails: AdminCryptoPayoutDetailsDto | null;
}

function VerifiedBadge({ verifiedAt }: { verifiedAt?: string }) {
  return verifiedAt ? (
    <Badge variant="outline" className={`gap-1 text-[10px] ${TINT.green}`}>
      <CheckCircleIcon className="h-3 w-3" />
      Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-[10px] text-yellow-700 dark:text-yellow-400"
    >
      Unverified
    </Badge>
  );
}

/**
 * Where disbursements go: the org's bank payout account and, when set, its
 * crypto settlement address. Read-only; account numbers arrive masked.
 */
export function PayoutDestinations({
  bankDetails,
  cryptoPayoutDetails,
}: PayoutDestinationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCardIcon className="h-4 w-4" />
          Payout destinations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
              Bank account
            </p>
            {bankDetails ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{bankDetails.bankName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {bankDetails.currency}
                  </Badge>
                  <VerifiedBadge verifiedAt={bankDetails.verifiedAt} />
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {bankDetails.accountName}
                </p>
                <p className="mt-0.5 font-mono text-sm">
                  {bankDetails.accountNumber}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No bank account linked.
              </p>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
              Crypto settlement
            </p>
            {cryptoPayoutDetails ? (
              <div>
                <div className="flex items-center gap-2">
                  <WalletIcon className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">
                    {cryptoPayoutDetails.asset}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {cryptoPayoutDetails.network}
                  </Badge>
                  <VerifiedBadge verifiedAt={cryptoPayoutDetails.verifiedAt} />
                </div>
                <p className="mt-1 font-mono text-sm">
                  {cryptoPayoutDetails.address}
                </p>
                {cryptoPayoutDetails.memo && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Memo: {cryptoPayoutDetails.memo}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No crypto settlement address set.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
