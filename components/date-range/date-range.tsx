"use client";

import * as React from "react";
import { DateRange as DateRangeType } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

import { DateRangeCaptionLabel } from "./parts";

type Props = {
  defaultValue?: DateRangeType;
} & React.ComponentProps<typeof Calendar>;

export function DateRange({ defaultValue, ...props }: Props) {
  const [selected, setSelected] = React.useState<DateRangeType | undefined>(
    defaultValue,
  );

  return (
    <Calendar
      mode="range"
      selected={selected}
      captionLayout="dropdown"
      components={{
        CaptionLabel: (props) => <DateRangeCaptionLabel {...props} />,
      }}
      // @ts-ignore
      onSelect={setSelected}
      {...props}
    />
  );
}
