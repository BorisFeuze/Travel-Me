"use client";
import * as React from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  multiRange?: boolean;
  onMultiRangeSelect?: (ranges: DateRange[]) => void;
  selectedRanges?: DateRange[];
};

function Calendar02({
  className,
  classNames,
  showOutsideDays = true,
  multiRange = false,
  onMultiRangeSelect,
  selectedRanges = [],
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());
  const [currentRange, setCurrentRange] = React.useState<DateRange | undefined>();

  // Sichere Array-Konvertierung
  const savedDates = React.useMemo(() => {
    const dates: Date[] = [];
    
    // Prüfe ob selectedRanges ein Array ist
    if (!Array.isArray(selectedRanges)) {
      console.warn('selectedRanges is not an array:', selectedRanges);
      return dates;
    }
    
    selectedRanges.forEach(range => {
      if (range?.from && range?.to) {
        // Konvertiere String-Daten zu Date-Objekten falls nötig
        const fromDate = range.from instanceof Date ? range.from : new Date(range.from);
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

  return (
    <div className="flex items-center justify-center gap-4">
      <DayPicker
        mode={multiRange ? "range" : props.mode}
        selected={multiRange ? currentRange : props.selected}
        onSelect={multiRange ? (range) => {
          setCurrentRange(range);
          // Nur speichern wenn BEIDE Daten ausgewählt sind UND sie unterschiedlich sind
          if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
            const currentRanges = Array.isArray(selectedRanges) ? selectedRanges : [];
            onMultiRangeSelect?.([...currentRanges, range]);
            setTimeout(() => setCurrentRange(undefined), 200);
          }
        } : props.onSelect}
        modifiers={{
          savedRange: savedDates
        }}
        modifiersClassNames={{
          savedRange: "bg-blue-500 text-white hover:bg-blue-600"
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
          day_range_start: "bg-blue-600 text-white rounded-l-md",
          day_range_end: "bg-blue-600 text-white rounded-r-md",
          day_range_middle: "bg-blue-200 text-blue-900",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}

Calendar02.displayName = "Calendar";
export { Calendar02 };