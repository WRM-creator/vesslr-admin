export type AdminRole = "super_admin" | "support" | "compliance" | "manager";
export type AdminStatus = "active" | "invited" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastActive: string; // ISO date string
  avatar?: string;
}
