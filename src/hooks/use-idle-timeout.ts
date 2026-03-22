import { useCallback, useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const PROMPT_BEFORE_IDLE = 2 * 60 * 1000; // 2 minutes before timeout

interface UseIdleTimeoutOptions {
  onTimeout: () => void;
}

export function useIdleTimeout({ onTimeout }: UseIdleTimeoutOptions) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const { activate, getRemainingTime } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    promptBeforeIdle: PROMPT_BEFORE_IDLE,
    crossTab: true,
    syncTimers: 200,
    stopOnIdle: true,
    onPrompt: () => {
      setShowPrompt(true);
      setRemainingSeconds(Math.ceil(getRemainingTime() / 1000));
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(Math.ceil(getRemainingTime() / 1000));
      }, 1000);
    },
    onIdle: () => {
      clearCountdown();
      setShowPrompt(false);
      onTimeout();
    },
    onActive: () => {
      clearCountdown();
      setShowPrompt(false);
    },
  });

  useEffect(() => {
    return clearCountdown;
  }, [clearCountdown]);

  const handleStayLoggedIn = useCallback(() => {
    clearCountdown();
    setShowPrompt(false);
    activate();
  }, [activate, clearCountdown]);

  const handleLogoutNow = useCallback(() => {
    clearCountdown();
    setShowPrompt(false);
    onTimeout();
  }, [onTimeout, clearCountdown]);

  return {
    showPrompt,
    remainingSeconds,
    handleStayLoggedIn,
    handleLogoutNow,
  };
}
