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
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  selectedRanges?: DateRange[];
  onMultiRangeSelect?: (ranges: DateRange[]) => void;
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
  classNames,
  showOutsideDays = true,
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());
  const [currentRange, setCurrentRange] = React.useState<DateRange | undefined>();
  const [monthsToShow, setMonthsToShow] = React.useState<number>(2);

  React.useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth < 1200 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const savedDates = React.useMemo(() => {
    const dates: Date[] = [];
    selectedRanges.forEach((range) => {
      if (range?.from && range?.to) {
        const fromDate = new Date(range.from);
        const toDate = new Date(range.to);
        const current = new Date(fromDate);
        while (current <= toDate) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      }
    });
    return dates;
  }, [selectedRanges]);

  const baseClassNames: Record<string, string> = {
    months: cn(
      "grid gap-8 justify-center items-start",
      monthsToShow === 1 ? "grid-cols-1" : "grid-cols-2",
      "transition-all duration-300 ease-in-out"
    ),
    month: cn(
      "flex flex-col items-center justify-start w-full",
      "text-gray-800 text-sm sm:text-[0.9rem]"
    ),
    caption: cn(
      "text-sm sm:text-base font-medium text-center text-gray-700 mb-3 sm:mb-4"
    ),
    table: "w-full border-collapse text-[13px] sm:text-[14px]",
    head_row: "flex justify-between mb-2",
    head_cell: "text-gray-500 w-8 font-normal text-[0.8rem] sm:text-[0.9rem]",
    row: "flex w-full justify-between",
    cell: cn(
      "text-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md",
      "hover:bg-gray-100 cursor-pointer text-sm transition-colors"
    ),
    day_selected: "bg-blue-600 text-white",
    day_today: "border border-blue-400",
    ...classNames,
  };

  const wrapperClasses = cn(
    "p-3 sm:p-5 rounded-2xl transition-all duration-300 ease-in-out",
    "flex flex-col items-center justify-center mx-auto",
    "bg-gray-50 shadow-sm",
    monthsToShow === 1
      ? "max-w-[400px]" 
      : "max-w-[850px]" 
  );

  const dayPickerProps = {
    month,
    onMonthChange: setMonth,
    numberOfMonths: monthsToShow,
    showOutsideDays,
    className: wrapperClasses,
    classNames: baseClassNames,
    modifiers: { savedRange: savedDates },
    modifiersClassNames: {
      savedRange: "bg-blue-500 text-white hover:bg-blue-600",
    },
  };

  // 🔹 Multi-Range Modus
  if (multiRange) {
    return (
      <DayPicker
        {...dayPickerProps}
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
      />
    );
  }

  // 🔹 Single-Date Modus
  return (
    <DayPicker
      {...dayPickerProps}
      mode="single"
      required
      selected={selectedDate}
      onSelect={onDateSelect as OnSelectHandler<Date>}
    />
  );
}
