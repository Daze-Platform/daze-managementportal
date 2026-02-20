import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface StoreBadgesProps {
  stores?: string[] | null;
  maxVisible?: number;
  className?: string;
}

export const StoreBadges: React.FC<StoreBadgesProps> = ({
  stores,
  maxVisible = 3,
  className,
}) => {
  if (!stores || stores.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">No venues assigned</span>
    );
  }

  const visible = stores.slice(0, maxVisible);
  const remaining = stores.slice(maxVisible);

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className ?? ""}`}>
      {visible.map((name, idx) => (
        <Badge
          key={`${name}-${idx}`}
          variant="secondary"
          className="max-w-[140px] truncate"
        >
          <span title={name} className="truncate inline-block align-middle">
            {name}
          </span>
        </Badge>
      ))}

      {remaining.length > 0 && (
        <HoverCard openDelay={150} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Badge variant="outline" className="cursor-default">
              +{remaining.length} more
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            sideOffset={8}
            className="z-50 w-64 p-3 bg-popover text-popover-foreground border shadow-md"
          >
            <div className="text-xs font-medium mb-2">Additional venues</div>
            <div className="grid grid-cols-1 gap-1">
              {remaining.map((name, idx) => (
                <div
                  key={`${name}-rem-${idx}`}
                  className="text-sm truncate"
                  title={name}
                >
                  {name}
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

export default StoreBadges;
