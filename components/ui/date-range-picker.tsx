import { forwardRef } from "react";
import { format } from "date-fns";
import { DateRange, DayPicker, SelectRangeEventHandler } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateRangePickerProps = {
  date: DateRange | undefined,
  onChange: SelectRangeEventHandler
} & React.ComponentProps<typeof DayPicker>;

const DateRangePicker = forwardRef(({ date, ...props }: DateRangePickerProps, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={props.onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
});

DateRangePicker.displayName = 'Date Range Picker';

export {
  DateRangePicker
}