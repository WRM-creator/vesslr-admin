"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_SELLER_RELIABILITY } from "../lib/analytics-model";

export function SellerReliabilityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Reliability</CardTitle>
        <CardDescription>Top performers by fulfillment rate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {MOCK_SELLER_RELIABILITY.slice(0, 5).map((seller, index) => (
          <div key={seller.sellerName} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {seller.sellerName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{seller.sellerName}</span>
              </div>
              <span className="text-muted-foreground">
                {seller.fulfillmentRate}% / {seller.rating}★
              </span>
            </div>
            <Progress value={seller.fulfillmentRate} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
