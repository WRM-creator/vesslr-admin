import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "dev@vesslr.com",
      password: "password",
    },
  });

  const { mutate, isPending } = api.auth.login.useMutation({
    onSuccess: (response) => {
      // The generated client implementation returns the response body directly
      const responseData = response?.data;
      const token = responseData?.token;

      if (!token) {
        setErrorMsg("No token received from server");
        return;
      }

      // We don't have refresh token or expiresAt in the type definition shown earlier clearly mapped
      // but let's assume standard behavior or just pass what we have.
      // The previous implementation tried to find refreshToken/expiresAt.
      // Based on type definition: data: { token: string, admin: {...} }
      // It seems we only get a token.
      const refreshToken = (responseData as any)?.refreshToken;
      login(token, refreshToken);

      const next = (loc.state as any)?.from || "/dashboard";
      nav(next, { replace: true });
    },
    onError: (error: any) => {
      console.error("Login error", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      setErrorMsg(msg);
    },
  });

  function onSubmit(values: LoginValues) {
    setErrorMsg("");
    mutate({
      body: values,
    });
  }

  // for display only
  const base =
    (import.meta.env.VITE_API_BASE as string) || "http://localhost:8001/api/v1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!!errorMsg && (
                <div className="rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-800">
                  {errorMsg}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
