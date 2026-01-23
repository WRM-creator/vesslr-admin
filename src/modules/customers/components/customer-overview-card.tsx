import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Building2, Calendar, Mail, Phone, User } from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerOverviewCardProps {
  data: CustomerDetails["overview"];
  status: CustomerDetails["admin"]["status"];
}

export function CustomerOverviewCard({
  data,
  status,
}: CustomerOverviewCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="border-background h-24 w-24 border-4 shadow-sm">
          <AvatarImage src={data.avatar} alt={data.name} />
          <AvatarFallback className="text-2xl">
            {data.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <h2 className="mt-4 text-xl font-bold">{data.name}</h2>

        <div className="mt-2 flex gap-2">
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "suspended"
                  ? "destructive"
                  : "secondary"
            }
          >
            {status}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {data.customerType}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            {data.customerType === "business" ? (
              <Building2 className="text-muted-foreground h-4 w-4" />
            ) : (
              <User className="text-muted-foreground h-4 w-4" />
            )}
          </div>
          <div className="space-y-1">
            <p className="leading-none font-medium">Type</p>
            <p className="text-muted-foreground capitalize">
              {data.customerType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <Mail className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="leading-none font-medium">Email</p>
            <p className="text-muted-foreground break-all">{data.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <Phone className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="leading-none font-medium">Phone</p>
            <p className="text-muted-foreground">{data.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <Calendar className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="leading-none font-medium">Member Since</p>
            <p className="text-muted-foreground">
              {format(new Date(data.memberSince), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
