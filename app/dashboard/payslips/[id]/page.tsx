"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Calendar,
  Users,
  CircleFadingPlus,
  PenTool,
  SendHorizonal,
  Timer,
  SearchX,
  Clock,
  CircleCheck,
  FileSearch,
  MessageSquareDiff,
  ChevronLeft,
  CornerRightDown,
  Search,
  Pencil,
} from "lucide-react";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { PlateEditor } from "@/components/plate-ui/plate-editor";
import { PlateEditorPreview } from "@/components/plate-ui/plate-editor-preview";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Feedback from "@/components/custom/Feedback";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { SpokeSpinner } from "@/components/ui/spinner";
import generator from "generate-password";
import useSWR, { useSWRConfig } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface Brief {
  id: string;
  title: string;
  content: string;
  status: string;
  authorId: string;
  deadline: {
    from: string;
    to: string;
  };
  assign: [
    {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  ];
  feedback: Feedback[];
  createdAt: string;
}

interface Feedback {
  id: string;
  content: string;
  userId: string;
  briefId: string;
  userSentId: string;
  status: string;
  isReply: boolean;
  replyId: string;
  isEdited: boolean;
  createdAt: string;
}

interface Payslip {
  id: string;
  userId: string;
  period: {
    from: string;
    to: string;
  };
  regularFee: number;
  presence: number;
  transportFee: number;
  thrFee: number;
  otherFee: number;
  totalFee: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DetailBrief({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit, watch, resetField } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const { mutate } = useSWRConfig();

  const [title, setTitle] = useState(null);
  const FORMAT_DATE = "dd LLL, y";
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: payslips, error } = useSWR<Payslip, Error>(
    `/api/payslips/${params.id}`,
    fetcher
  );
  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher
  );

  // console.log(payslips);

  return payslips && users ? (
    <Fragment>
      <title>
        {title
          ? `${title} - Task Management System`
          : "Detail Payslip - Task Management System"}
      </title>
      <div className="min-h-screen w-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <form className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="" onClick={() => Router.back()}>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Detail Payslip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex gap-3 w-full">
                    <Controller
                      control={control}
                      name="userId"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <Label htmlFor="userId">Team Member</Label>
                          <Select
                            onValueChange={(range) => {
                              field.onChange(range);
                            }}
                            disabled
                            value={payslips.userId}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                ?.filter((user) => user.role === "Team Member")
                                .map((user, i) => (
                                  <SelectItem key={i} value={user.id}>
                                    {user.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="period"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <Label htmlFor="period">Period</Label>
                          <DateRangePicker
                            mode="range"
                            setValue={{
                              //@ts-ignore
                              from: payslips.period.from,
                              //@ts-ignore
                              to: payslips.period.to,
                            }}
                            disabled
                          />
                        </div>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="fee"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="fee">Fee</Label>
                        <MoneyInput
                          id="fee"
                          currency={"Rp."}
                          placeholder="Input Nominal"
                          disabled
                          value={payslips.regularFee}
                        />
                      </div>
                    )}
                  />
                  <div className="flex gap-3 w-full">
                    <Controller
                      control={control}
                      name="presence"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <Label htmlFor="presence">Presence</Label>
                          <Input
                            id="presence"
                            type="number"
                            placeholder="Input Presence Day"
                            maxLength={2}
                            disabled
                            value={payslips.presence}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="transportFee"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <div className="flex items-end gap-2">
                            <Label htmlFor="transportFee">Transport Fee</Label>
                            <span className="text-xs text-slate-500">
                              * 25k / day
                            </span>
                          </div>
                          <MoneyInput
                            id="transportFee"
                            currency={"Rp."}
                            placeholder="Input Nominal"
                            disabled
                            value={payslips.transportFee}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <Controller
                      control={control}
                      name="thrFee"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <div className="flex items-end gap-2">
                            <Label htmlFor="thrFee">THR</Label>
                            <span className="text-xs text-slate-500">
                              * optional
                            </span>
                          </div>
                          <MoneyInput
                            id="thrFee"
                            currency={"Rp."}
                            placeholder="Input Nominal"
                            disabled
                            value={payslips.thrFee}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="otherFee"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <div className="flex items-end gap-2">
                            <Label htmlFor="otherFee">Other Fee</Label>
                            <span className="text-xs text-slate-500">
                              * optional
                            </span>
                          </div>
                          <MoneyInput
                            id="otherFee"
                            currency={"Rp."}
                            placeholder="Input Nominal"
                            disabled
                            value={payslips.otherFee}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="totalFee"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="totalFee">Total Fee</Label>
                        <MoneyInput
                          currency={"Rp."}
                          id="totalFee"
                          disabled
                          value={payslips.totalFee}
                        />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-start gap-2">
            {/* <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              variant="gooeyLeft"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <SpokeSpinner size="sm" />
                  Loading...
                </div>
              ) : (
                "Create an user"
              )}
            </Button> */}
          </div>
        </form>
      </div>
      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
