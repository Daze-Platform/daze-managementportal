import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Copy, MoreHorizontal, Link2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  multipleSelection: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: ModifierOption[];
}

interface OptionSetCardProps {
  group: ModifierGroup;
  assignedItemsCount?: number;
  onEdit: (group: ModifierGroup) => void;
  onDelete: (group: ModifierGroup) => void;
  onDuplicate?: (group: ModifierGroup) => void;
  onAssign?: (group: ModifierGroup) => void;
}

export const OptionSetCard: React.FC<OptionSetCardProps> = ({
  group,
  assignedItemsCount = 0,
  onEdit,
  onDelete,
  onDuplicate,
  onAssign,
}) => {
  const selectionText = group.multipleSelection
    ? group.minSelections && group.minSelections > 0
      ? `${group.minSelections}–${group.maxSelections || "∞"} selections`
      : `Up to ${group.maxSelections || "∞"} selections`
    : "Single choice";

  return (
    <motion.div
      layout
      className="group relative bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-muted-foreground/20 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base mb-1 truncate">
            {group.name}
          </h3>
          {group.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {group.description}
            </p>
          )}
        </div>

        {/* Actions - always visible on mobile, hover on desktop */}
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(group)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(group)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(group)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onAssign && (
                <DropdownMenuItem onClick={() => onAssign(group)}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Assign to Items
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(group)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {group.required && (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium"
          >
            Required
          </Badge>
        )}
        <Badge
          variant="secondary"
          className={`text-xs font-medium ${
            group.multipleSelection
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {selectionText}
        </Badge>
        {assignedItemsCount > 0 && (
          <Badge variant="outline" className="text-xs font-medium">
            {assignedItemsCount} item{assignedItemsCount !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Options Preview */}
      <div className="space-y-1.5">
        {group.options.slice(0, 4).map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              {option.isDefault && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              )}
              <span className="text-foreground truncate">{option.name}</span>
            </div>
            {option.price !== 0 && (
              <span
                className={`text-xs font-medium ml-2 shrink-0 ${
                  option.price > 0 ? "text-success" : "text-destructive"
                }`}
              >
                {option.price > 0 ? "+" : ""}$
                {Math.abs(option.price).toFixed(2)}
              </span>
            )}
          </div>
        ))}
        {group.options.length > 4 && (
          <div className="flex items-center justify-center px-3 py-2 text-sm text-muted-foreground">
            +{group.options.length - 4} more option
            {group.options.length - 4 !== 1 ? "s" : ""}
          </div>
        )}
        {group.options.length === 0 && (
          <div className="flex items-center justify-center px-3 py-4 text-sm text-muted-foreground bg-muted/30 rounded-lg">
            No options defined
          </div>
        )}
      </div>
    </motion.div>
  );
};
