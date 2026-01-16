import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { AdminsTable } from "../components/admins-table";
import type { AdminUser } from "../types";

const mockAdmins: AdminUser[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex.morgan@vesslr.com",
    role: "super_admin",
    status: "active",
    lastActive: new Date().toISOString(),
    avatar: "https://github.com/shadcn.png"
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@vesslr.com",
    role: "manager",
    status: "active",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james.wilson@vesslr.com",
    role: "compliance",
    status: "invited",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: "4",
    name: "Mike Ross",
    email: "mike.ross@vesslr.com",
    role: "support",
    status: "suspended",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
  }
];

export default function Admins() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Manage Admins"
        endContent={
          <Button>
            <Plus  />
            Invite Admin
          </Button>
        }
      />
      
      <AdminsTable data={mockAdmins} />
    </div>
  );
}
