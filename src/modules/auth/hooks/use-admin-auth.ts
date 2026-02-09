import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type LoginValues, type OtpValues } from "../schemas";

export function useAdminAuth() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [tempEmail, setTempEmail] = useState("");

  const { mutate: loginMutate, isPending: isLoginPending } =
    api.auth.login.useMutation({
      onSuccess: (response: any) => {
        const data = response;
        // Check if OTP is required
        if (data?.requiresOtp) {
          setTempEmail(data.email);
          setStep("otp");
          return;
        }

        // Fallback for dev/legacy behavior without OTP if enabled
        const token = data?.accessToken || data?.token;
        if (token) {
          const refreshToken = data?.refreshToken;
          login(token, refreshToken);
          const next = (loc.state as any)?.from || "/dashboard";
          nav(next, { replace: true });
        } else {
          setErrorMsg("Unexpected response from server");
        }
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

  const { mutate: verifyOtpMutate, isPending: isVerifyPending } =
    api.auth.verifyOtp.useMutation({
      onSuccess: (response: any) => {
        const data = response;
        const token = data?.accessToken || data?.token;

        if (token) {
          const refreshToken = data?.refreshToken;
          login(token, refreshToken);
          const next = (loc.state as any)?.from || "/dashboard";
          nav(next, { replace: true });
        } else {
          setErrorMsg("Failed to verify OTP. No token received.");
        }
      },
      onError: (error: any) => {
        console.error("OTP Verification error", error);
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Invalid OTP. Please try again.";
        setErrorMsg(msg);
      },
    });

  function onLoginSubmit(values: LoginValues) {
    setErrorMsg("");
    loginMutate({
      body: values,
    });
  }

  function onOtpSubmit(values: OtpValues) {
    setErrorMsg("");
    verifyOtpMutate({
      body: {
        email: tempEmail,
        otp: values.otp,
      },
    });
  }

  return {
    step,
    setStep,
    errorMsg,
    setErrorMsg,
    isLoginPending,
    isVerifyPending,
    onLoginSubmit,
    onOtpSubmit,
    tempEmail,
  };
}
