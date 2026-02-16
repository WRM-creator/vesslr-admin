import { useEffect, useState } from "react";

interface CountdownResult {
  timeRemaining: string;
  isExpired: boolean;
}

export function useOfferCountdown(
  expiresAt: string | undefined,
): CountdownResult {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) {
    return { timeRemaining: "", isExpired: false };
  }

  const diff = new Date(expiresAt).getTime() - now;

  if (diff <= 0) {
    return { timeRemaining: "Expired", isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let timeRemaining: string;
  if (hours > 0) {
    timeRemaining = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    timeRemaining = `${minutes}m ${seconds}s`;
  } else {
    timeRemaining = `${seconds}s`;
  }

  return { timeRemaining, isExpired: false };
}
