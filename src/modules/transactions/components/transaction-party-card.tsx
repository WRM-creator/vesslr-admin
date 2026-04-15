import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface TransactionPartyCardProps {
  role: "Buyer" | "Seller";
  name: string;
  profileLink?: string;
}

export function TransactionPartyCard({
  role,
  name,
  profileLink,
}: TransactionPartyCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{role}</CardTitle>
        {profileLink && (
          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
            <Link to={profileLink}>View</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="font-Matter-Medium text-lg">{name}</div>
      </CardContent>
    </Card>
  );
}
