"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ChevronLeft,
  Check,
  ChevronsUpDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/custom/Navbar";
import { userList } from "@/app/constants/userList";

const Page = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 14),
  });

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/brief">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_300px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Brief Content</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Title</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        placeholder="Input Name"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Description</Label>
                      <Textarea id="description" className="min-h-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Brief Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Assign</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {value
                              ? userList.find((user) => user.name === value)
                                  ?.name
                              : "Select user..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search user..." />
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {userList
                                  .filter((user) => user.role === "Team Member")
                                  .map((option) => (
                                    <CommandItem
                                      key={option.name}
                                      value={option.name}
                                      onSelect={(currentValue) => {
                                        setValue(
                                          currentValue === value
                                            ? ""
                                            : currentValue
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          value === option.name
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {option.name}
                                    </CommandItem>
                                  ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="status">Deadline</Label>
                      <div className={cn("grid gap-2", className)}>
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
                      </div>
                    </div>
                    <div className="hidden">
                      <input type="hidden" name="assigned" value={"assigned"} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-start gap-2 ">
            <Button size="sm">Add Brief</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
