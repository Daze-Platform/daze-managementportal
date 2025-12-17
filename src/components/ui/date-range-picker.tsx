import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  numberOfMonths?: number;
}

export function DateRangePicker({ value, onChange, className, numberOfMonths = 2 }: DateRangePickerProps) {
  const formatRange = (range?: DateRange) => {
    if (!range?.from && !range?.to) return "Pick a date";
    if (range?.from && range?.to) return `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`;
    if (range?.from) return format(range.from, "MMM dd, yyyy");
    return "Pick a date";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-9 justify-start text-left font-normal bg-white border-gray-300 hover:border-gray-400 focus:border-gray-500 shadow-sm hover:bg-gray-50",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
          {value?.from || value?.to ? (
            <span className="text-sm text-gray-900">{formatRange(value)}</span>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border-gray-300 shadow-xl z-50" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          numberOfMonths={numberOfMonths}
        />
      </PopoverContent>
    </Popover>
  );
}
