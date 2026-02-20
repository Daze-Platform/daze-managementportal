import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 sm:p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base sm:text-sm font-semibold text-gray-800",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 sm:h-7 sm:w-7 bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 p-0 transition-all duration-200 shadow-sm",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-600 rounded-md w-10 sm:w-9 font-semibold text-sm sm:text-xs uppercase tracking-wider",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 sm:h-9 sm:w-9 text-center text-sm p-0 relative hover:bg-blue-50 focus-within:relative focus-within:z-20 rounded-md transition-colors duration-200",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 sm:h-9 sm:w-9 p-0 font-medium hover:bg-blue-100 hover:text-blue-900 focus:bg-blue-100 focus:text-blue-900 text-gray-700 transition-all duration-200 rounded-md",
        ),
        day_range_end:
          "day-range-end bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white font-semibold shadow-md",
        day_today:
          "bg-blue-50 text-blue-900 font-semibold border-2 border-blue-200",
        day_outside:
          "day-outside text-gray-400 opacity-60 hover:text-gray-500 hover:opacity-80",
        day_disabled:
          "text-gray-300 opacity-50 cursor-not-allowed hover:bg-transparent",
        day_range_middle:
          "aria-selected:bg-blue-100 aria-selected:text-blue-900 hover:bg-blue-200 bg-blue-50 text-blue-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => (
          <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4 text-gray-600" />
        ),
        IconRight: ({ ..._props }) => (
          <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4 text-gray-600" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
