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
  className,
  classNames,
  showOutsideDays = true,
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());
  const [currentRange, setCurrentRange] = React.useState<DateRange | undefined>();
  const [monthsToShow, setMonthsToShow] = React.useState(2);

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

  const baseClassNames = {
    months:
      "flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center justify-center",
    caption: "text-sm font-medium text-center text-gray-700 mb-2",
    table: "w-full border-collapse",
    head_row: "flex justify-between mb-2",
    head_cell: "text-gray-500 w-8 font-normal text-[0.8rem]",
    row: "flex w-full justify-between",
    cell: "text-center w-8 h-8 rounded-md hover:bg-gray-100 cursor-pointer text-sm",
    day_selected: "bg-blue-600 text-white",
    day_today: "border border-blue-400",
    ...classNames,
  };

  const wrapperClasses = cn(
    "p-4 sm:p-5 w-full max-w-[700px] sm:max-w-[800px] mx-auto transition-all",
    className
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

  if (multiRange) {
    return (
      <DayPicker
        {...dayPickerProps}
        mode="range"
        selected={currentRange}
        onSelect={(range: DateRange | undefined) => {
          setCurrentRange(range);
          if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
            onMultiRangeSelect?.([...selectedRanges, range]);
            setTimeout(() => setCurrentRange(undefined), 200);
          }
        }}
      />
    );
  }

  return (
    <DayPicker
      {...dayPickerProps}
      mode="single"
      required={true}
      selected={selectedDate}
      onSelect={onDateSelect as OnSelectHandler<Date>}
    />
  );
}
