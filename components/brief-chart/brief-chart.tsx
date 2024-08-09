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
import { Brief } from "@/types/brief";
import { getMonth, getDate } from "date-fns";

interface BriefMonth {
  week: string;
  brief: number;
}

interface ChartProps {
  users: User[];
  userExist: User;
  briefs: Brief[];
}

const BriefChart = ({ users, briefs, userExist }: ChartProps) => {
  const [briefUser, setBriefUser] = useState<Brief[]>([]);
  const [briefMonthTotal, setBriefMonthTotal] = useState<Brief[]>([]);
  const [briefMonthDone, setBriefMonthDone] = useState<Brief[]>([]);
  const [briefMonth, setBriefMonth] = useState<BriefMonth[]>([]);
  const [select, setSelect] = useState<string>("");

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

  useEffect(() => {
    const filterBriefUser = (userId: string) => {
      // console.log(userId);
      const briefUserData = briefs.filter((data) =>
        data.assign.find(({ id }) => id === userId),
      );
      setBriefUser(briefUserData);
      setSelect(userId);

      const filterMonth = briefUserData.filter(
        (brief) =>
          getMonth(new Date(brief.createdAt)).toString() ===
            getMonth(Date()).toString() && brief.status === "Done",
      );

      setBriefMonthDone(filterMonth);
      setBriefMonthTotal(
        briefUserData.filter(
          (brief) =>
            getMonth(new Date(brief.createdAt)).toString() ===
            getMonth(Date()).toString(),
        ),
      );

      const getDateBrief = filterMonth.map((data) => {
        return {
          date: getDate(new Date(data.createdAt)),
        };
      });

      const week1 = getDateBrief.filter(
        (data) => data.date > 0 && data.date <= 7,
      ).length;
      const week2 = getDateBrief.filter(
        (data) => data.date > 7 && data.date <= 14,
      ).length;
      const week3 = getDateBrief.filter(
        (data) => data.date > 14 && data.date <= 21,
      ).length;
      const week4 = getDateBrief.filter((data) => data.date > 21).length;

      setBriefMonth([
        { week: "Week 1", brief: week1 },
        { week: "Week 2", brief: week2 },
        { week: "Week 3", brief: week3 },
        { week: "Week 4", brief: week4 },
      ]);
    };

    if (userExist.role === "Team Member") {
      filterBriefUser(userExist.id);
    }
  }, [userExist, briefs]);

  const filterBriefUser = (userId: string) => {
    // console.log(userId);
    const briefUserData = briefs.filter((data) =>
      data.assign.find(({ id }) => id === userId),
    );
    setBriefUser(briefUserData);
    setSelect(userId);

    const filterMonth = briefUserData.filter(
      (brief) =>
        getMonth(new Date(brief.createdAt)).toString() ===
          getMonth(Date()).toString() && brief.status === "Done",
    );

    setBriefMonthDone(filterMonth);
    setBriefMonthTotal(
      briefUserData.filter(
        (brief) =>
          getMonth(new Date(brief.createdAt)).toString() ===
          getMonth(Date()).toString(),
      ),
    );

    const getDateBrief = filterMonth.map((data) => {
      return {
        date: getDate(new Date(data.createdAt)),
      };
    });

    const week1 = getDateBrief.filter(
      (data) => data.date > 0 && data.date <= 7,
    ).length;
    const week2 = getDateBrief.filter(
      (data) => data.date > 7 && data.date <= 14,
    ).length;
    const week3 = getDateBrief.filter(
      (data) => data.date > 14 && data.date <= 21,
    ).length;
    const week4 = getDateBrief.filter((data) => data.date > 21).length;

    setBriefMonth([
      { week: "Week 1", brief: week1 },
      { week: "Week 2", brief: week2 },
      { week: "Week 3", brief: week3 },
      { week: "Week 4", brief: week4 },
    ]);
  };

  const filterBriefMonth = (month: string) => {
    const filterMonth = briefUser.filter(
      (brief) =>
        getMonth(new Date(brief.createdAt)).toString() === month &&
        brief.status === "Done",
    );

    setBriefMonthDone(filterMonth);
    setBriefMonthTotal(
      briefUser.filter(
        (brief) => getMonth(new Date(brief.createdAt)).toString() === month,
      ),
    );

    const getDateBrief = filterMonth.map((data) => {
      return {
        date: getDate(new Date(data.createdAt)),
      };
    });

    const week1 = getDateBrief.filter(
      (data) => data.date > 0 && data.date <= 7,
    ).length;
    const week2 = getDateBrief.filter(
      (data) => data.date > 7 && data.date <= 14,
    ).length;
    const week3 = getDateBrief.filter(
      (data) => data.date > 14 && data.date <= 21,
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
              onValueChange={(value) => {
                filterBriefUser(value);
              }}
              defaultValue="clxwp751h0007gxqmk3hi6pt5"
              value={select}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.role === "Team Member")
                  .map((user, i) => (
                    <SelectItem key={i} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {briefUser.length ? (
              <Select
                onValueChange={(value) => filterBriefMonth(value)}
                defaultValue={getMonth(Date()).toString()}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {month.map((m, i) => (
                    <SelectItem key={i} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {briefMonth.length && userExist.role !== "Team Member" ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <RefreshCcw
                      onClick={() => resetFilter()}
                      className="h-4 w-4 cursor-pointer text-slate-500 transition duration-300 hover:text-slate-900"
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
        {briefMonthDone.length ||
        briefMonthTotal.length ||
        briefMonth.length ? (
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="flex items-center gap-2 text-sm"
            >
              <CircleCheck className="h-4 w-4" />
              Brief done : {briefMonthDone.length}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 text-sm"
            >
              <Package className="h-4 w-4" />
              Brief total : {briefMonthTotal.length}
            </Badge>
          </div>
        ) : null}
        {briefMonth.length ? (
          <div>
            <ChartContainer
              config={{
                brief: {
                  label: "Brief",
                  color: "#020617",
                },
              }}
            >
              <LineChart
                accessibilityLayer
                data={briefMonth}
                margin={{
                  left: 20,
                  right: 20,
                  top: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
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
          <div className="flex h-28 items-center justify-center text-sm text-slate-500">
            Please select data...
          </div>
        )}
      </CardContent>
    </Card>
  ) : null;
};

export default BriefChart;
