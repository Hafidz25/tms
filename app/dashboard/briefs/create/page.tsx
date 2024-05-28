"use client";

import { useState, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { userList } from "@/data/user";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { PlateEditor } from "@/components/plate-ui/plate-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chips } from "@/components/ui/chips";
import { Divider } from "@/components/ui/divider";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function CreateBrief() {
  const { control, register, handleSubmit } = useForm();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 14),
  });

  const userChipList = userList.
    filter(user => user.role !== 'Admin' && user.role !== 'Customer Server').
    map(user => {
    const { id, name: text } = user;
    return {
      id,
      text,
    }
  })

  const handleSubmitBrief = (data: any) => {
    console.log(data);
  };

  return (
    <Fragment>
      <div className="container py-10 max-w-[1400px]">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSubmitBrief)}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard/briefs"
              className="w-8 h-8 rounded-lg border border-slate-300 grid place-items-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            <Button size="sm" type="submit">
              Add Brief
            </Button>
          </div>

          <Divider className="my-10" />

          <div className="flex flex-col gap-y-6">
            <Input
              type="text"
              className="w-full border-0 p-0 ring-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:capitalize text-[40px] font-bold"
              placeholder="Judul Brief..."
              autoComplete="off"
              {...register("Judul")}
            />

            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-start sm:max-w-2xl">
              <input
                type="hidden"
                {...register("status", {
                  value: "assigned",
                })}
              />

              <Controller
                control={control}
                name="Deadline"
                defaultValue={date}
                render={({ field }) => (
                  <DateRangePicker
                    date={date}
                    onChange={(range) => {
                      setDate(range);
                      field.onChange(range);
                    }}
                  />
                )}
              />

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              <Controller
                control={control}
                name="operator"
                render={({ field }) => (
                  <Chips chipItems={userChipList} onChange={(value) => {
                    field.onChange(value.map(data => ({id: data.id})))
                  }} />
                )}
              />
            </div>
          </div>

          <Divider className="my-10" />

          <div className="border rounded-lg">
            <Controller
              control={control}
              name="Editor"
              render={({ field }) => (
                <PlateEditor
                  // @ts-ignore
                  onChange={(editorValue: any) => {
                    field.onChange(editorValue);
                  }}
                />
              )}
            />
          </div>
        </form>
      </div>

      {/* <DevTool control={control} /> */}
    </Fragment>
  );
}
