"use client";

import * as React from "react";
import Link from "next/link";
import PlateEditor from "@/components/plate-ui/plate-editor";

import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Chips } from "@/components/ui/chips";
import { Divider } from "@/components/ui/divider";

const Page = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 14),
  });

  return (
    <div className="container py-10 max-w-[1400px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard/briefs">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>

          <Button size="sm">Add Brief</Button>
        </div>

        <Divider className="my-6" />

        <div className="flex flex-col gap-y-6">
          <Input
            id="name"
            type="text"
            className="w-full border-0 p-0 ring-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:capitalize text-[40px] font-bold"
            placeholder="Judul Brief..."
            autoComplete="off"
          />

          <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-center sm:max-w-2xl">
            <input type="hidden" name="assigned" value={"assigned"} />

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
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <div className="hidden sm:block sm:w-1 h-1 sm:h-8 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

            <Chips/>
          </div>
        </div>

        <Divider className="my-6" />

        <div className="border rounded-lg">
          <PlateEditor />
        </div>
      </div>
    </div>
  );
};

export default Page;
