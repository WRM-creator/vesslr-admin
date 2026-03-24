import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;
  return (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module") ||
    (error.name === "ChunkLoadError")
  );
}

export function AppErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    if (isChunkLoadError(error)) {
      const reloadKey = "chunk_reload";
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Only auto-reload once per 30 seconds to avoid infinite reload loops
      if (!lastReload || now - Number(lastReload) > 30_000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    }
  }, [error]);

  let errorMessage = "An unexpected error occurred.";
  let errorDetails = "";

  if (isChunkLoadError(error)) {
    errorMessage =
      "A new version of the app is available. Please refresh the page.";
  } else if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = error.data?.message || "Something went wrong.";
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="bg-destructive/10 rounded-full p-4">
        <AlertCircle className="text-destructive h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">{errorMessage}</p>
        {errorDetails && (
          <pre className="bg-muted text-muted-foreground mt-4 max-w-[600px] overflow-auto rounded-lg p-4 text-left font-mono text-xs">
            {errorDetails}
          </pre>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </div>
  );
}
