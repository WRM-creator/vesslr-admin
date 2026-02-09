import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
