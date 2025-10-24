"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar02({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        caption: "text-sm font-medium text-center text-gray-700 mb-2",
        nav: "flex items-center justify-between",
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
  );
}

Calendar02.displayName = "Calendar";

export { Calendar02 };

