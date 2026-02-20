import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "border-border text-foreground bg-transparent",
        success:
          "border-transparent bg-success text-success-foreground shadow-sm",
        warning:
          "border-transparent bg-warning text-warning-foreground shadow-sm",
        info: "border-transparent bg-info text-info-foreground shadow-sm",
        flat: "border-transparent bg-primary/10 text-primary",
        faded: "border-2 border-border bg-muted text-foreground",
        light: "border-transparent bg-transparent text-primary",
        dot: "border-transparent bg-muted text-muted-foreground pl-2",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] rounded-md",
        default: "px-2.5 py-0.5 text-xs rounded-lg",
        lg: "px-3 py-1 text-sm rounded-xl",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        default: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "full",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string;
}

function Badge({
  className,
  variant,
  size,
  radius,
  dotColor,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, radius }), className)}
      {...props}
    >
      {variant === "dot" && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full mr-1.5",
            dotColor || "bg-primary",
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
