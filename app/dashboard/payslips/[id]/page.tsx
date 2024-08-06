"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft, Eye, Pen } from "lucide-react";

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
import { PayslipPdf } from "@/components/payslip-pdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toNumber } from "lodash-es";
import { toast } from "sonner";
import { SpokeSpinner } from "@/components/ui/spinner";

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

export default function DetailPayslip({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit, watch, setValue, getValues } =
    useForm();
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  const [transportFee, setTransportFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [name, setName] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [fee, setFee] = useState("0");
  const [presence, setPresence] = useState("");
  const [thr, setThr] = useState("");
  const [other, setOther] = useState("");
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");

  const [title, setTitle] = useState(null);
  const [editMode, setEditMode] = useState(false);
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

  const countTotal = () => {
    setTotalFee(
      (getValues("fee") ? toNumber(getValues("fee")) : 0) +
        (getValues("transportFee") ? getValues("transportFee") : 0) +
        (getValues("thrFee") ? toNumber(getValues("thrFee")) : 0) +
        (getValues("otherFee") ? toNumber(getValues("otherFee")) : 0)
    );
  };

  const formatMonth = payslips?.period.to
    ? format(payslips?.period.to, "LLLL", { locale: id })
    : "";

  // console.log(payslips);

  const handleSubmitData = async (data: any) => {
    const newData = {
      userId: data.userId ? data.userId : payslips?.userId,
      levelId: data.levelId ? data.levelId : payslips?.levelId,
      position: data.position ? data.position : payslips?.position,
      period: data.period ? data.period : payslips?.period,
      fee: data.fee ? toNumber(data.fee) : toNumber(payslips?.regularFee),
      presence: data.presence
        ? toNumber(data.presence)
        : toNumber(payslips?.presence),
      transportFee: data.presence
        ? toNumber(data.presence) * 25000
        : toNumber(payslips?.transportFee),
      thrFee: data.thrFee ? toNumber(data.thrFee) : toNumber(payslips?.thrFee),
      otherFee: data.otherFee
        ? toNumber(data.otherFee)
        : toNumber(payslips?.otherFee),
    };

    const totalData = {
      userId: newData.userId,
      levelId: newData.levelId,
      position: newData.position,
      period: newData.period,
      regularFee: newData.fee,
      presence: newData.presence,
      transportFee: newData.transportFee,
      thrFee: newData.thrFee,
      otherFee: newData.otherFee,
      totalFee:
        // @ts-ignore
        newData.fee + newData.transportFee + newData.thrFee + newData.otherFee,
    };
    // console.log(totalData);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/payslips/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(totalData),
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Payslip updated successfully.");
        setIsLoading(false);
        location.reload();
        // Router.push("/dashboard/payslips");
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.");
      }
      return response;
    } catch (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return payslips && users && levelFee && formatMonth ? (
    <Fragment>
      <title>
        {editMode
          ? `Edit Payslip - Task Management System`
          : "Detail Payslip - Task Management System"}
      </title>
      <div className="min-h-screen w-full flex flex-col justify-center gap-4 p-4 md:gap-4 md:p-8">
        <div className="w-full lg:w-[73rem] justify-between self-center flex items-center gap-4">
          <Link href="/dashboard/payslips">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          {editMode ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setEditMode(false)}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setEditMode(true)}
            >
              <Pen className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        <div className=" w-full flex flex-col lg:flex-row justify-center gap-4 md:gap-4">
          <form
            onSubmit={handleSubmit(handleSubmitData)}
            className="grid w-full lg:max-w-[36rem] flex-1 auto-rows-max gap-4"
          >
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>{editMode ? "Edit" : "Detail"} Payslip</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                      <Controller
                        control={control}
                        name="userId"
                        render={({ field }) => (
                          <div className="grid gap-3 w-full">
                            <Label htmlFor="userId">Team Member</Label>
                            <Select
                              onValueChange={(range) => {
                                field.onChange(range);
                                setName(
                                  users
                                    .filter(
                                      (user) => user.id === getValues("userId")
                                    )
                                    .map((user) => user.name)
                                    .join(", ")
                                );
                              }}
                              disabled={editMode ? false : true}
                              // value={payslips.userId}
                              defaultValue={payslips.userId}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select User" />
                              </SelectTrigger>
                              <SelectContent>
                                {users
                                  ?.filter(
                                    (user) => user.role === "Team Member"
                                  )
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
                              disabled={editMode ? false : true}
                              defaultValue={payslips.position}
                              onChange={(range) => {
                                field.onChange(range);
                                setPosition(getValues("position"));
                              }}
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
                              from: editMode
                                ? periodFrom
                                : payslips.period.from,
                              //@ts-ignore
                              to: editMode ? periodTo : payslips.period.to,
                            }}
                            disabled={editMode ? false : true}
                            onChange={(range) => {
                              field.onChange(range);
                              // setPeriod(getValues("period"));
                              setPeriodFrom(
                                getValues("period")?.from
                                  ? format(
                                      getValues("period").from,
                                      FORMAT_DATE
                                    )
                                  : ""
                              );
                              setPeriodTo(
                                getValues("period")?.to
                                  ? format(getValues("period").to, FORMAT_DATE)
                                  : ""
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                      <Controller
                        control={control}
                        name="levelId"
                        render={({ field }) => (
                          <div className="grid gap-3 w-full">
                            <Label htmlFor="levelId">Level</Label>
                            <Select
                              onValueChange={(range) => {
                                field.onChange(range);
                                setFee(
                                  levelFee
                                    ?.filter(
                                      (data) => data.id === getValues("levelId")
                                    )
                                    .map((data) => data.regularFee)
                                    .join("")
                                );
                                setLevel(
                                  levelFee
                                    ?.filter(
                                      (data) => data.id === getValues("levelId")
                                    )
                                    .map((data) => data.level)
                                    .join("")
                                );
                                setValue(
                                  "fee",
                                  levelFee
                                    ?.filter(
                                      (data) => data.id === getValues("levelId")
                                    )
                                    .map((data) => data.regularFee)
                                    .join("")
                                );
                                countTotal();
                              }}
                              disabled={editMode ? false : true}
                              defaultValue={editMode ? "" : payslips.levelId}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                {levelFee?.map((data, i) => (
                                  <SelectItem key={i} value={data.id}>
                                    {data.level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              value={editMode ? fee : payslips.regularFee}
                              // @ts-ignore
                              onValueChange={(value) => field.onChange(value)}
                              onInput={(value) => field.onChange(value)}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 w-full">
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
                              disabled={editMode ? false : true}
                              defaultValue={payslips.presence}
                              onChange={(range) => {
                                field.onChange(range);
                                setValue(
                                  "transportFee",
                                  getValues("presence") * 25000
                                );
                                setTransportFee(getValues("presence") * 25000);
                                countTotal();
                                setPresence(getValues("presence"));
                              }}
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
                              <Label htmlFor="transportFee">
                                Transport Fee
                              </Label>
                              <span className="text-xs text-slate-500">
                                * 25k / day
                              </span>
                            </div>
                            <MoneyInput
                              id="transportFee"
                              currency={"Rp."}
                              placeholder="Input Nominal"
                              disabled
                              value={
                                editMode ? transportFee : payslips.transportFee
                              }
                              // @ts-ignore
                              onValueChange={(value) => field.onChange(value)}
                              onInput={(value) => field.onChange(value)}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 w-full">
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
                              disabled={editMode ? false : true}
                              defaultValue={payslips.thrFee}
                              // @ts-ignore
                              onValueChange={(value) => {
                                field.onChange(value);
                                countTotal();
                                setThr(getValues("thrFee"));
                              }}
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
                              disabled={editMode ? false : true}
                              defaultValue={payslips.otherFee}
                              // @ts-ignore
                              onValueChange={(value) => {
                                field.onChange(value);
                                countTotal();
                                setOther(getValues("otherFee"));
                              }}
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
                            value={editMode ? totalFee : payslips.totalFee}
                            onChange={(range) => {
                              field.onChange(range);
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-start gap-2">
              {editMode ? (
                <Button
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
                    "Update Payslip"
                  )}
                </Button>
              ) : null}
              {editMode ? null : (
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
                    .map((user) => user.name)} - Payslip ${formatMonth}`}
                >
                  <Button type="button" size="sm" variant="outline">
                    Export PDF
                  </Button>
                </PDFDownloadLink>
              )}
            </div>
          </form>
          <PDFViewer
            showToolbar={false}
            className="w-full lg:w-[30rem] xl:w-[36rem] h-[20rem] md:h-[36rem] xl:h-[54rem] rounded-lg"
          >
            {editMode ? (
              <PayslipPdf
                name={name}
                level={level}
                position={position}
                periodTo={periodTo}
                periodFrom={periodFrom}
                fee={fee}
                presence={presence}
                transportFee={transportFee}
                thr={thr}
                other={other}
                totalFee={totalFee}
              />
            ) : (
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
            )}
          </PDFViewer>
        </div>
      </div>
      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}
