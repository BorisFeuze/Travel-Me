"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar02({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Kalender */}
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        numberOfMonths={2}
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-row space-x-4",
          caption: "text-sm font-medium text-center text-gray-700 mb-2",
          table: "w-full border-collapse",
          head_row: "flex justify-between mb-2",
          head_cell: "text-gray-500 w-8 font-normal text-[0.8rem]",
          row: "flex w-full justify-between",
          cell: "text-center w-8 h-8 rounded-md hover:bg-gray-100 cursor-pointer text-sm",
          day_selected: "bg-blue-600 text-white",
          day_today: "border border-blue-400",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}

Calendar02.displayName = "Calendar";

export { Calendar02 };
