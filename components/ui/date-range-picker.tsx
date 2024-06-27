import { forwardRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { DateRange, DayPickerRangeProps } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends DayPickerRangeProps {
  onChange?: ((range?: DateRange) => void) | undefined;
  placeholder?: string;
  setValue?: {
    from: string | undefined;
    to: string | undefined;
  };
}

const DateRangePicker = forwardRef(
  (
    {
      onChange,
      placeholder = "Pick a date",
      setValue,
      ...props
    }: DateRangePickerProps,
    ref
  ) => {
    const [date, setDate] = useState<DateRange | undefined>({
      from: undefined,
      to: undefined,
    });

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
            {setValue ? (
              <>
                {setValue.from && format(parseISO(setValue.from), "LLL dd, y")}{" "}
                -{" "}
                {setValue.to ? format(parseISO(setValue.to), "LLL dd, y") : ""}
              </>
            ) : date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {/* {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )} */}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            {...props}
            initialFocus
            defaultMonth={date?.from}
            selected={
              setValue
                ? {
                    from: setValue.from ? parseISO(setValue.from) : undefined,
                    to: setValue.to ? parseISO(setValue.to) : undefined,
                  }
                : date
            }
            mode="range"
            onSelect={(range) => {
              setDate(range);
              if (onChange) onChange(range);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DateRangePicker.displayName = "Date Range Picker";

export { DateRangePicker };
