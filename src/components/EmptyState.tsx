import React from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Use a smaller, in-card variant when nested inside other content. */
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}) => {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center justify-center text-center py-10 px-6"
          : "flex flex-col items-center justify-center text-center py-16 px-6 min-h-[60vh]"
      }
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/60 text-muted-foreground mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-5">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="min-w-[160px]">
          {action.label}
        </Button>
      )}
    </div>
  );
};
