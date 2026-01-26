import { client } from "./generated/client.gen";

// Configure base URL from environment variable
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
client.setConfig({
  baseUrl: baseUrl.replace(/\/api$/, ""), // Strip /api suffix if present, endpoints include it
});

// Request interceptor: add auth token
client.interceptors.request.use((request) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_auth_token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return request;
});

// Response interceptor: handle 401 and refresh token
client.interceptors.response.use(async (response, request, options) => {
  // Check if error is 401 and we haven't retried yet
  if (response.status === 401 && !(options as any)._retry) {
    (options as any)._retry = true;

    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("admin_refresh_token");

      if (refreshToken) {
        try {
          // Use fetch directly to avoid infinite loops with the client interceptors
          const refreshResponse = await fetch(
            `${baseUrl}/api/v1/admin/auth/refresh-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            },
          );

          const data = await refreshResponse.json();

          if (data.success && data.data) {
            // Update stored tokens
            localStorage.setItem("admin_auth_token", data.data.accessToken);
            localStorage.setItem("admin_refresh_token", data.data.refreshToken);

            // Update Authorization header for the retry
            const newHeaders = new Headers(options.headers as HeadersInit);
            newHeaders.set("Authorization", `Bearer ${data.data.accessToken}`);

            // Retry the original request
            const result = await client.request({
              ...options,
              headers: newHeaders,
              _retry: true,
            } as any);

            return result.response;
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      // If we get here, refresh failed or no refresh token exists
      // Clear auth state and dispatch logout event
      localStorage.removeItem("admin_auth_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_expires_at");
      window.dispatchEvent(new Event("auth:logout"));
    }
  }

  return response;
});

export { client };
