"use client";

import * as React from "react";
import {
  DayPicker,
  type DateRange,
  type OnSelectHandler,
} from "react-day-picker";
import { cn } from "@/lib";
import "react-day-picker/dist/style.css";

export type CalendarProps = {
  multiRange?: boolean;
  selectedDate?: Date; // für Single-Mode
  onDateSelect?: (date: Date) => void; // für Single-Mode
  selectedRanges?: DateRange[]; // für Multi-Mode
  onMultiRangeSelect?: (ranges: DateRange[]) => void; // für Multi-Mode
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
};

export function Calendar02({
  multiRange = false,
  selectedDate,
  onDateSelect,
  selectedRanges = [],
  onMultiRangeSelect,
  className,
  classNames,
  showOutsideDays = true,
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());
  const [currentRange, setCurrentRange] = React.useState<
    DateRange | undefined
  >();

  // convert selectedRanges to individual dates for modifiers
  const savedDates = React.useMemo(() => {
    const dates: Date[] = [];
    selectedRanges.forEach((range) => {
      if (range?.from && range?.to) {
        const fromDate =
          range.from instanceof Date ? range.from : new Date(range.from);
        const toDate = range.to instanceof Date ? range.to : new Date(range.to);
        const current = new Date(fromDate);
        while (current <= toDate) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      }
    });
    return dates;
  }, [selectedRanges]);

  // Multi-Range Mode
  if (multiRange) {
    return (
      <DayPicker
        mode="range"
        selected={currentRange}
        onSelect={(range: DateRange | undefined) => {
          setCurrentRange(range);
          if (
            range?.from &&
            range?.to &&
            range.from.getTime() !== range.to.getTime()
          ) {
            onMultiRangeSelect?.([...selectedRanges, range]);
            setTimeout(() => setCurrentRange(undefined), 200);
          }
        }}
        modifiers={{ savedRange: savedDates }}
        modifiersClassNames={{
          savedRange: "bg-blue-500 text-white hover:bg-blue-600",
        }}
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
      />
    );
  }

  // Single-Mode
  return (
    <DayPicker
      mode="single"
      required={true}
      selected={selectedDate}
      onSelect={onDateSelect as OnSelectHandler<Date>}
      modifiers={{ savedRange: savedDates }}
      modifiersClassNames={{
        savedRange: "bg-blue-500 text-white hover:bg-blue-600",
      }}
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
    />
  );
}
