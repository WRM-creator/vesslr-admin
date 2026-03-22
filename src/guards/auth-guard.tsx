import { IdleTimeoutDialog } from "@/components/shared/idle-timeout-dialog";
import { useIdleTimeout } from "@/hooks/use-idle-timeout";
import { useAuth } from "@/providers/auth-provider";
import { useCallback } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

/**
 * Renders authenticated content with idle timeout monitoring.
 * Extracted as a separate component so hooks are not called conditionally.
 */
function AuthenticatedContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleIdleTimeout = useCallback(() => {
    logout();
    localStorage.setItem("admin_session_expired", "true");
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const { showPrompt, remainingSeconds, handleStayLoggedIn, handleLogoutNow } =
    useIdleTimeout({ onTimeout: handleIdleTimeout });

  return (
    <>
      <Outlet />
      <IdleTimeoutDialog
        open={showPrompt}
        remainingSeconds={remainingSeconds}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogoutNow}
      />
    </>
  );
}

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AuthenticatedContent />;
}
