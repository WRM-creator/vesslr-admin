import { api } from "@/lib/api";

/**
 * Reads the current admin's effective permissions off the profile query. The
 * profile response is generated as an untyped map, so we narrow it here rather
 * than casting at every call site. Returns `false` until the profile loads.
 */
export const useAdminPermissions = () => {
  const { data: profileData } = api.auth.profile.useQuery({});
  const profile = profileData as unknown as {
    effectivePermissions?: string[];
  } | null;

  const permissions = profile?.effectivePermissions ?? [];
  const hasPermission = (permission: string) => permissions.includes(permission);

  return { permissions, hasPermission };
};
