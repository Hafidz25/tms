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
import { toInteger, toNumber } from "lodash-es";
import useSWR, { useSWRConfig } from "swr";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import PayslipPdf from "@/components/custom/PayslipPdf";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

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
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);

  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
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

  const handleSubmitData = async (data: any) => {
    const newData = {
      userId: data.userId,
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
      position: newData.position,
      period: newData.period,
      reqularFee: newData.fee,
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

  return users ? (
    <div className="min-h-screen w-full flex justify-center gap-4 p-4 md:gap-4 md:p-8">
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="grid max-w-[36rem] flex-1 auto-rows-max gap-4"
      >
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
              <CardTitle>Create Payslip</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Controller
                  control={control}
                  name="userId"
                  render={({ field }) => (
                    <div className="grid gap-3">
                      <Label htmlFor="userId">Team Member</Label>
                      <Select
                        onValueChange={(range) => {
                          field.onChange(range);
                          setName(
                            users
                              .filter((user) => user.id === getValues("userId"))
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
                    <div className="grid gap-3">
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
                <Controller
                  control={control}
                  name="period"
                  render={({ field }) => (
                    <div className="grid gap-3">
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
                        // @ts-ignore
                        onValueChange={(value) => {
                          field.onChange(value);
                          countTotal();
                          setFee(getValues("fee"));
                        }}
                      />
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="presence"
                  render={({ field }) => (
                    <div className="grid gap-3">
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
                    <div className="grid gap-3">
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
                <Controller
                  control={control}
                  name="thrFee"
                  render={({ field }) => (
                    <div className="grid gap-3">
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
                    <div className="grid gap-3">
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
        <div className="flex items-center justify-start gap-2">
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
              "Create an user"
            )}
          </Button>
          <PDFDownloadLink
            document={
              <PayslipPdf
                name={name}
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
            }
            fileName={`${name} - Payslip`}
          >
            <Button type="button" size="sm" variant="outline">
              Export PDF
            </Button>
          </PDFDownloadLink>
        </div>
      </form>
      <PDFViewer className="w-[36rem]">
        <PayslipPdf
          name={name}
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
