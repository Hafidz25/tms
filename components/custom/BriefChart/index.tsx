"use client";
import React, { useEffect, useState } from "react";
import { RefreshCcw, CircleCheck, Package } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CartesianGrid, XAxis, Line, LineChart } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { Brief } from "@/types/briefs";
import { getMonth, getDate } from "date-fns";

interface BriefMonth {
  week: string;
  brief: number;
}

const BriefChart = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [briefUser, setBriefUser] = useState<Brief[]>([]);
  const [briefMonthTotal, setBriefMonthTotal] = useState<Brief[]>([]);
  const [briefMonthDone, setBriefMonthDone] = useState<Brief[]>([]);
  const [briefMonth, setBriefMonth] = useState<BriefMonth[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [select, setSelect] = useState<string>("");
  // console.log(briefMonth);

  useEffect(() => {
    fetch("/api/briefs")
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
      });
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
      });
  }, []);

  const month = [
    {
      value: "0",
      label: "Jan",
    },
    {
      value: "1",
      label: "Feb",
    },
    {
      value: "2",
      label: "Mar",
    },
    {
      value: "3",
      label: "Apr",
    },
    {
      value: "4",
      label: "May",
    },
    {
      value: "5",
      label: "Jun",
    },
    {
      value: "6",
      label: "Jul",
    },
    {
      value: "7",
      label: "Aug",
    },
    {
      value: "8",
      label: "Sep",
    },
    {
      value: "9",
      label: "Oct",
    },
    {
      value: "10",
      label: "Nov",
    },
    {
      value: "11",
      label: "Dec",
    },
  ];

  const filterBriefUser = (userId: string) => {
    // console.log(userId);
    setBriefUser(
      briefs.filter((data) => data.assign.find(({ id }) => id === userId))
    );
    setSelect(userId);

    // filterBriefMonth(getMonth(new Date()).toString());
  };

  const filterBriefMonth = (month: string) => {
    const filterMonth = briefUser.filter(
      (brief) =>
        getMonth(new Date(brief.createdAt)).toString() === month &&
        brief.status === "Done"
    );

    setBriefMonthDone(filterMonth);
    setBriefMonthTotal(
      briefUser.filter(
        (brief) => getMonth(new Date(brief.createdAt)).toString() === month
      )
    );

    const getDateBrief = filterMonth.map((data) => {
      return {
        date: getDate(new Date(data.createdAt)),
      };
    });

    const week1 = getDateBrief.filter(
      (data) => data.date > 0 && data.date <= 7
    ).length;
    const week2 = getDateBrief.filter(
      (data) => data.date > 7 && data.date <= 14
    ).length;
    const week3 = getDateBrief.filter(
      (data) => data.date > 14 && data.date <= 21
    ).length;
    const week4 = getDateBrief.filter((data) => data.date > 21).length;

    setBriefMonth([
      { week: "Week 1", brief: week1 },
      { week: "Week 2", brief: week2 },
      { week: "Week 3", brief: week3 },
      { week: "Week 4", brief: week4 },
    ]);
  };

  const resetFilter = () => {
    setBriefUser([]);
    setBriefMonth([]);
    setBriefMonthDone([]);
    setBriefMonthTotal([]);
    setSelect("");
  };

  return briefs.length && users.length ? (
    <Card className="h-full w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>
          A line chart showing brief have done for the last months.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              disabled={briefUser.length ? true : false}
              onValueChange={(value) => filterBriefUser(value)}
              value={select}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.role === "Team Member")
                  .map((user) => (
                    <SelectItem value={user.id}>{user.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {briefUser.length ? (
              <Select onValueChange={(value) => filterBriefMonth(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {month.map((m) => (
                    <SelectItem value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {briefMonth.length ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <RefreshCcw
                      onClick={() => resetFilter()}
                      className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-900 transition duration-300"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Reset filter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
        </div>
        {briefMonthDone.length && briefMonthTotal.length ? (
          <div className="flex gap-4 items-center">
            <Badge
              variant="outline"
              className="flex gap-2 text-sm items-center"
            >
              <CircleCheck className="w-4 h-4" />
              Brief done : {briefMonthDone.length}
            </Badge>
            <Badge
              variant="outline"
              className="flex gap-2 text-sm items-center"
            >
              <Package className="w-4 h-4" />
              Brief total : {briefMonthTotal.length}
            </Badge>
          </div>
        ) : null}
        {briefMonth.length ? (
          <div className="aspect-[16/9]">
            <ChartContainer
              config={{
                desktop: {
                  label: "Brief",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <LineChart
                accessibilityLayer
                data={briefMonth}
                margin={{
                  left: 28,
                  right: 28,
                }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="brief"
                  stroke="#020617"
                  strokeWidth={2}
                  dot={true}
                  isAnimationActive={true}
                />
              </LineChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-28 text-sm text-slate-500">
            Please select data...
          </div>
        )}
      </CardContent>
    </Card>
  ) : null;
};

export default BriefChart;
