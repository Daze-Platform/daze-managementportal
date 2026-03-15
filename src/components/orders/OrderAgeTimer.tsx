import React from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { useOrderAge } from "@/hooks/useOrderAgeTimer";

interface OrderAgeTimerProps {
  createdAt?: string | null;
  timeFallback?: string;
  className?: string;
}

const colorMap = {
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: "text-emerald-500",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: "text-amber-500",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "text-red-500",
  },
};

export const OrderAgeTimer = ({
  createdAt,
  timeFallback,
  className = "",
}: OrderAgeTimerProps) => {
  const age = useOrderAge(createdAt, timeFallback);
  const colors = colorMap[age.color];

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} ${className}`}
      animate={
        age.color === "red"
          ? { scale: [1, 1.04, 1], opacity: [1, 0.85, 1] }
          : {}
      }
      transition={
        age.color === "red"
          ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          : {}
      }
    >
      <Timer className={`w-3 h-3 flex-shrink-0 ${colors.icon}`} />
      <span>{age.display}</span>
    </motion.div>
  );
};
