import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface TransactionPartyCardProps {
  role: string;
  name: string;
  company: string;
  avatar?: string;
  link: string;
  badges?: string[];
}

export function TransactionPartyCard({
  role,
  name,
  company,
  avatar,
  link,
  badges = [],
}: TransactionPartyCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {role}
            </span>
            {badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="h-5 px-1.5 text-[10px]"
              >
                {badge}
              </Badge>
            ))}
          </div>
          <div className="text-base font-semibold">{name}</div>
          {/* <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Building2 className="h-3 w-3" />
            {company}
          </div> */}
        </div>
        <Button variant="ghost" size="sm" className="text-foreground" asChild>
          <Link to={link}>View</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
