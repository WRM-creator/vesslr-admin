import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "../components/login-form";
import { OtpForm } from "../components/otp-form";
import { useAdminAuth } from "../hooks/use-admin-auth";

export default function Login() {
  const {
    step,
    setStep,
    errorMsg,
    setErrorMsg,
    isLoginPending,
    isVerifyPending,
    onLoginSubmit,
    onOtpSubmit,
    tempEmail,
  } = useAdminAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            {step === "credentials"
              ? "Enter your credentials to access the dashboard"
              : `Enter the code sent to ${tempEmail}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!!errorMsg && (
            <div className="mb-4 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-800">
              {errorMsg}
            </div>
          )}
          {step === "credentials" ? (
            <LoginForm onSubmit={onLoginSubmit} isLoading={isLoginPending} />
          ) : (
            <OtpForm
              onSubmit={onOtpSubmit}
              onBack={() => {
                setStep("credentials");
                setErrorMsg("");
              }}
              isLoading={isVerifyPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
