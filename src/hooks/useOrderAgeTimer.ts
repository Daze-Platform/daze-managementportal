import { useState, useEffect } from "react";

export type AgeColor = "green" | "amber" | "red";

export interface OrderAge {
  display: string;
  color: AgeColor;
  totalSeconds: number;
}

/**
 * Parses the order's `time` field (e.g. "2m ago", "15m ago", "1h ago", "Just now")
 * into an approximate number of seconds elapsed since the order was placed.
 * This is a fallback when a real `created_at` timestamp is unavailable.
 */
function parseTimeStringToSeconds(timeStr: string): number {
  if (!timeStr || timeStr === "Just now") return 0;

  const minuteMatch = timeStr.match(/(\d+)m\s*ago/);
  if (minuteMatch) return parseInt(minuteMatch[1]) * 60;

  const hourMatch = timeStr.match(/(\d+)h\s*ago/);
  if (hourMatch) return parseInt(hourMatch[1]) * 3600;

  const hourMinMatch = timeStr.match(/(\d+)h\s+(\d+)m\s*ago/);
  if (hourMinMatch)
    return parseInt(hourMinMatch[1]) * 3600 + parseInt(hourMinMatch[2]) * 60;

  return 0;
}

function formatAge(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function getAgeColor(totalSeconds: number): AgeColor {
  const minutes = totalSeconds / 60;
  if (minutes < 5) return "green";
  if (minutes < 10) return "amber";
  return "red";
}

/**
 * Returns a live-updating order age given a `created_at` ISO string or a
 * time-string fallback (e.g. "3m ago").
 */
export function useOrderAge(
  createdAt?: string | null,
  timeFallback?: string,
): OrderAge {
  const getInitialSeconds = () => {
    if (createdAt) {
      const elapsed = Math.floor(
        (Date.now() - new Date(createdAt).getTime()) / 1000,
      );
      return elapsed >= 0 ? elapsed : 0;
    }
    return parseTimeStringToSeconds(timeFallback || "");
  };

  const [totalSeconds, setTotalSeconds] = useState<number>(getInitialSeconds);

  useEffect(() => {
    // Recompute base on mount or when inputs change
    setTotalSeconds(getInitialSeconds());

    const timer = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdAt, timeFallback]);

  return {
    display: formatAge(totalSeconds),
    color: getAgeColor(totalSeconds),
    totalSeconds,
  };
}
