"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SpokeSpinner } from "@/components/ui/spinner";
import { MoneyInput } from "@/components/ui/money-input";
import { toNumber } from "lodash-es";
import useSWR from "swr";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PayslipPdf } from "@/components/payslip-pdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LevelFee {
  id: string;
  level: number;
  regularFee: number;
}

const FORMAT_DATE = "dd LLLL y";

const CreatePayslip = () => {
  const { control, register, handleSubmit, getValues, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transportFee, setTransportFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [name, setName] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [fee, setFee] = useState("");
  const [presence, setPresence] = useState("");
  const [thr, setThr] = useState("");
  const [other, setOther] = useState("");
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);

  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher
  );

  const { data: levelFee, error } = useSWR<LevelFee[], Error>(
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

  const formatMonth =
    periodTo === "" ? null : format(periodTo, "LLLL", { locale: id });

  const handleSubmitData = async (data: any) => {
    const newData = {
      userId: data.userId,
      levelId: data.levelId,
      position: data.position,
      period: data.period,
      fee: toNumber(data.fee),
      presence: data.presence ? toNumber(data.presence) : 0,
      transportFee: data.presence ? toNumber(data.presence) * 25000 : 0,
      thrFee: data.thrFee ? toNumber(data.thrFee) : 0,
      otherFee: data.otherFee ? toNumber(data.otherFee) : 0,
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
        newData.fee + newData.transportFee + newData.thrFee + newData.otherFee,
    };
    // console.log(totalData);
    setIsLoading(true);
    try {
      const response = await fetch("/api/payslips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(totalData),
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("Payslip created successfully.");
        setIsLoading(false);
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

  return users && levelFee ? (
    <div className="min-h-screen w-full flex flex-col  justify-center gap-4 p-4 md:gap-4 md:p-8">
      <div className="w-full lg:w-[73rem] justify-between self-center flex items-center gap-4">
        <Link href="/dashboard/payslips">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
      </div>
      <div className=" w-full flex flex-col lg:flex-row justify-center gap-4 md:gap-4">
        <form
          onSubmit={handleSubmit(handleSubmitData)}
          className="grid w-full lg:max-w-[36rem] flex-1 auto-rows-max gap-4"
        >
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Create Payslip</CardTitle>
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
                            required
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
                          onChange={(range) => {
                            field.onChange(range);
                            // setPeriod(getValues("period"));
                            setPeriodFrom(
                              format(getValues("period").from, FORMAT_DATE)
                            );
                            setPeriodTo(
                              getValues("period").to
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
                            value={fee}
                            disabled
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
                            value={transportFee}
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
                            defaultValue={0}
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
                            defaultValue={0}
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
                          onChange={(range) => {
                            field.onChange(range);
                          }}
                          value={totalFee}
                        />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-start gap-2 w-full">
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
                "Create payslip"
              )}
            </Button>
            <PDFDownloadLink
              document={
                <PayslipPdf
                  name={name}
                  position={position}
                  level={level}
                  periodTo={periodTo}
                  periodFrom={periodFrom}
                  fee={fee}
                  presence={presence}
                  transportFee={transportFee}
                  thr={thr}
                  other={other}
                  totalFee={totalFee}
                />
              }
              fileName={`${name} - Payslip ${formatMonth}`}
            >
              <Button type="button" size="sm" variant="outline">
                Export PDF
              </Button>
            </PDFDownloadLink>
          </div>
        </form>
        <PDFViewer
          showToolbar={false}
          className="w-full lg:w-[30rem] xl:w-[36rem] h-[20rem] md:h-[36rem] xl:h-[54rem] rounded-lg"
        >
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
        </PDFViewer>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
};

export default CreatePayslip;
