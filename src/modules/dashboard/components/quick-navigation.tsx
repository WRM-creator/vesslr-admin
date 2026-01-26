import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  FileText,
  FolderTree,
  Package,
  ScrollText,
  ShipIcon,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "merchants",
    label: "Merchants",
    description: "Manage seller accounts",
    icon: <Store className="h-5 w-5" />,
    href: "/merchants",
  },
  {
    id: "customers",
    label: "Customers",
    description: "Manage buyer accounts",
    icon: <Users className="h-5 w-5" />,
    href: "/customers",
  },
  {
    id: "products",
    label: "Products",
    description: "Browse listings",
    icon: <Package className="h-5 w-5" />,
    href: "/products",
  },
  {
    id: "categories",
    label: "Categories",
    description: "Organize catalog",
    icon: <FolderTree className="h-5 w-5" />,
    href: "/categories",
  },
  {
    id: "transactions",
    label: "Transactions",
    description: "View all orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/transactions",
  },
  {
    id: "logistics",
    label: "Logistics",
    description: "Track fulfillments",
    icon: <ShipIcon className="h-5 w-5" />,
    href: "/logistics",
  },
  {
    id: "escrows",
    label: "Escrows",
    description: "Manage held funds",
    icon: <FileText className="h-5 w-5" />,
    href: "/escrows",
  },
  {
    id: "disputes",
    label: "Disputes",
    description: "Resolve conflicts",
    icon: <ScrollText className="h-5 w-5" />,
    href: "/disputes",
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "View reports",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/analytics",
  },
];

export function QuickNavigation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Navigation</CardTitle>
        <CardDescription>
          Jump to common areas of the admin panel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="group bg-card hover:border-primary/50 hover:bg-accent flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:shadow-sm"
            >
              <div className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary rounded-md p-2 transition-colors">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-muted-foreground text-xs">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
