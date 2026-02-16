import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | undefined | null,
  currency: string = "NGN",
): string {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
