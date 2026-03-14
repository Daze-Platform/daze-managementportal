import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, duration = 0.4, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
FadeIn.displayName = "FadeIn";

export const ScaleIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, duration = 0.3, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
ScaleIn.displayName = "ScaleIn";

export const SlideIn = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps & { direction?: "left" | "right" | "up" | "down" }
>(
  (
    {
      children,
      delay = 0,
      duration = 0.3,
      direction = "up",
      className,
      ...props
    },
    ref,
  ) => {
    const directionOffset = {
      left: { x: -24, y: 0 },
      right: { x: 24, y: 0 },
      up: { x: 0, y: 24 },
      down: { x: 0, y: -24 },
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, ...directionOffset[direction] }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, ...directionOffset[direction] }}
        transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
SlideIn.displayName = "SlideIn";

export const StaggerContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps & { staggerDelay?: number }
>(({ children, staggerDelay = 0.1, className, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
));
StaggerContainer.displayName = "StaggerContainer";

export const StaggerItem = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
StaggerItem.displayName = "StaggerItem";

export const HoverScale = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps & { scale?: number }
>(({ children, scale = 1.02, className, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    className={cn("cursor-pointer", className)}
    {...props}
  >
    {children}
  </motion.div>
));
HoverScale.displayName = "HoverScale";

export const HoverLift = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
HoverLift.displayName = "HoverLift";

export const PressScale = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
PressScale.displayName = "PressScale";

export const PopIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, delay = 0, duration = 0.3, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration,
        delay,
        ease: [0.68, -0.55, 0.265, 1.55], // bounce-in easing
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
PopIn.displayName = "PopIn";

export const ShakeOnError = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps & { shake?: boolean }
>(({ children, shake = false, className, ...props }, ref) => (
  <motion.div
    ref={ref}
    animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
));
ShakeOnError.displayName = "ShakeOnError";

export const PulseIndicator = ({
  className,
  color = "current",
}: {
  className?: string;
  color?: string;
}) => (
  <span className={cn("relative flex h-3 w-3", className)}>
    <span
      className={cn(
        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        `bg-${color}`,
      )}
    />
    <span
      className={cn("relative inline-flex rounded-full h-3 w-3", `bg-${color}`)}
    />
  </span>
);

export const GlowPulse = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps & { glowColor?: string }
>(
  (
    { children, glowColor = "hsl(var(--primary) / 0.3)", className, ...props },
    ref,
  ) => (
    <motion.div
      ref={ref}
      animate={{
        boxShadow: [
          `0 0 0 0 ${glowColor}`,
          `0 0 20px 4px ${glowColor}`,
          `0 0 0 0 ${glowColor}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
GlowPulse.displayName = "GlowPulse";

export const AnimatedNumber = ({
  value,
  duration = 1,
}: {
  value: number;
  duration?: number;
}) => (
  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={value}>
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value.toLocaleString()}
    </motion.span>
  </motion.span>
);

export const SuccessCheck = ({ show }: { show: boolean }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-success-foreground"
  >
    <motion.svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      initial={{ pathLength: 0 }}
      animate={show ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.path
        d="M5 12l5 5L20 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  </motion.div>
);
