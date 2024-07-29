"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft } from "lucide-react";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import useSWR, { useSWRConfig } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PayslipPdf from "@/components/custom/PayslipPdf";
import { format } from "date-fns";

const FORMAT_DATE = "dd LLLL y";

interface Payslip {
  id: string;
  userId: string;
  levelId: string;
  position: string;
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

interface LevelFee {
  id: string;
  level: number;
  regularFee: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DetailBrief({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit, watch, resetField } = useForm();
  const { mutate } = useSWRConfig();

  const [title, setTitle] = useState(null);
  const FORMAT_DATE = "dd LLLL y";
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
  const { data: levelFee, error: levelError } = useSWR<LevelFee[], Error>(
    "/api/level-fee",
    fetcher
  );

  // console.log(payslips);

  return payslips && users && levelFee ? (
    <Fragment>
      <title>
        {title
          ? `${title} - Task Management System`
          : "Detail Payslip - Task Management System"}
      </title>
      <div className="min-h-screen w-full flex justify-center gap-4 p-4 md:gap-4 md:p-8">
        <form className="grid max-w-[36rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/payslips">
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
                      name="position"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <Label htmlFor="period">Position</Label>
                          <Input
                            id="position"
                            type="text"
                            placeholder="e.g Illustrator Designer"
                            disabled
                            value={payslips.position}
                          />
                        </div>
                      )}
                    />
                  </div>
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
                  <div className="flex gap-3 w-full">
                    <Controller
                      control={control}
                      name="levelId"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
                          <Label htmlFor="levelId">Level</Label>
                          <Input
                            id="levelId"
                            type="text"
                            placeholder="e.g Illustrator Designer"
                            disabled
                            value={levelFee
                              ?.filter((data) => data.id === payslips.levelId)
                              .map((data) => data.level)
                              .join("")}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="fee"
                      render={({ field }) => (
                        <div className="grid gap-3 w-full">
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
                  </div>
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
            <PDFDownloadLink
              document={
                <PayslipPdf
                  name={users
                    ?.filter((user) => user.id === payslips.userId)
                    .map((user) => user.name)}
                  position={payslips.position}
                  periodTo={format(payslips.period.to, FORMAT_DATE)}
                  periodFrom={format(payslips.period.from, FORMAT_DATE)}
                  fee={payslips.regularFee}
                  presence={payslips.presence}
                  transportFee={payslips.transportFee}
                  thr={payslips.thrFee}
                  other={payslips.otherFee}
                  totalFee={payslips.totalFee}
                  level={levelFee
                    ?.filter((data) => data.id === payslips.levelId)
                    .map((data) => data.level)
                    .join("")}
                />
              }
              fileName={`${users
                ?.filter((user) => user.id === payslips.userId)
                .map((user) => user.name)} - Payslip`}
            >
              <Button type="button" size="sm" variant="shine">
                Export PDF
              </Button>
            </PDFDownloadLink>
          </div>
        </form>
        <PDFViewer showToolbar={false} className="w-[36rem] h-100 rounded-lg">
          <PayslipPdf
            name={users
              ?.filter((user) => user.id === payslips.userId)
              .map((user) => user.name)}
            position={payslips.position}
            periodTo={format(payslips.period.to, FORMAT_DATE)}
            periodFrom={format(payslips.period.from, FORMAT_DATE)}
            fee={payslips.regularFee}
            presence={payslips.presence}
            transportFee={payslips.transportFee}
            thr={payslips.thrFee}
            other={payslips.otherFee}
            totalFee={payslips.totalFee}
            level={levelFee
              ?.filter((data) => data.id === payslips.levelId)
              .map((data) => data.level)
              .join("")}
          />
        </PDFViewer>
      </div>
      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
