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
import { sum, toNumber } from "lodash-es";
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
  roleMemberId: string;
  levelId: string;
}

interface RoleMember {
  id: string;
  name: string;
  level: [
    {
      id: string;
      name: string;
      fee: number;
    },
  ];
  user: [];
  createdAt: string;
}

interface AdditionalFee {
  name: string;
  fee: number;
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
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [additionalFee, setAdditionalFee] = useState<AdditionalFee[]>([]);
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);

  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher,
  );

  const { data: roleMember, error } = useSWR<RoleMember[], Error>(
    "/api/role-member",
    fetcher,
  );

  const countTotal = () => {
    setTotalFee(
      (getValues("fee") ? toNumber(getValues("fee")) : 0) +
        (getValues("transportFee") ? getValues("transportFee") : 0) +
        additionalFee.reduce(function (s, a) {
          return s + toNumber(a.fee);
        }, 0),
    );
  };

  const formatMonth =
    periodTo === "" ? null : format(periodTo, "LLLL", { locale: id });

  // const sumValues = (obj: Record<string, number>) =>
  //   Object.values(obj).reduce((a, b) => a + b, 0);

  // console.log(sumValues( 5, 6, 7 ));

  const handleSubmitData = async (data: any) => {
    const newData = {
      userId: data.userId,
      period: data.period,
      fee: toNumber(data.fee),
      presence: data.presence ? toNumber(data.presence) : 0,
      transportFee: data.presence ? toNumber(data.presence) * 25000 : 0,
      additionalFee: additionalFee.map((data) => {
        return {
          name: data.name,
          fee: toNumber(data.fee),
        };
      }),
      additionalFeeTotal: additionalFee.reduce(function (s, a) {
        return s + toNumber(a.fee);
      }, 0),
    };

    const totalData = {
      userId: newData.userId,
      period: newData.period,
      regularFee: newData.fee,
      presence: newData.presence,
      transportFee: newData.transportFee,
      additionalFee: newData.additionalFee,
      totalFee: newData.fee + newData.transportFee + newData.additionalFeeTotal,
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

  const handleFormChange = (index: number, event: any, name: string) => {
    let data = [...additionalFee];
    //@ts-ignore
    data[index][name] = event;
    setAdditionalFee(data);
  };

  const addFields = () => {
    let newfield: AdditionalFee = { name: "", fee: 0 };
    setAdditionalFee([
      ...additionalFee,
      {
        name: newfield.name,
        fee: toNumber(newfield.fee),
      },
    ]);
  };

  const removeFields = (index: number) => {
    let data = [...additionalFee];
    data.splice(index, 1);
    setAdditionalFee(data);
  };

  // console.log(additionalFee);

  return users && roleMember ? (
    <div className="flex min-h-screen w-full flex-col justify-center gap-4 p-4 md:gap-4 md:p-8">
      <div className="flex w-full items-center justify-between gap-4 self-center lg:w-[73rem]">
        <Link href="/dashboard/payslips">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
      </div>
      <div className="flex w-full flex-col justify-center gap-4 md:gap-4 lg:flex-row">
        <form
          onSubmit={handleSubmit(handleSubmitData)}
          className="grid w-full flex-1 auto-rows-max gap-4 lg:max-w-[36rem]"
        >
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Create Payslip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex w-full flex-col gap-3 md:flex-row">
                    <Controller
                      control={control}
                      name="userId"
                      render={({ field }) => (
                        <div className="grid w-full gap-3">
                          <Label htmlFor="userId">Team Member</Label>
                          <Select
                            onValueChange={(range) => {
                              field.onChange(range);
                              setName(
                                users
                                  .filter(
                                    (user) => user.id === getValues("userId"),
                                  )
                                  .map((user) => user.name)
                                  .join(", "),
                              );
                              const roleMemberId = users
                                .filter(
                                  (user) => user.id === getValues("userId"),
                                )
                                .map((user) => user.roleMemberId)
                                .join(", ");
                              const levelId = users
                                .filter(
                                  (user) => user.id === getValues("userId"),
                                )
                                .map((user) => user.levelId)
                                .join(", ");
                              setPosition(
                                roleMember
                                  .filter((data) => data.id === roleMemberId)
                                  .map((data) => data.name)
                                  .join(","),
                              );
                              setLevel(
                                roleMember
                                  .filter((data) => data.id === roleMemberId)
                                  .map((data) =>
                                    data.level
                                      .filter((data) => data.id === levelId)
                                      .map((data) => data.name)
                                      .join(","),
                                  )
                                  .join(","),
                              );
                              setFee(
                                roleMember
                                  .filter((data) => data.id === roleMemberId)
                                  .map((data) =>
                                    data.level
                                      .filter((data) => data.id === levelId)
                                      .map((data) => data.fee)
                                      .join(","),
                                  )
                                  .join(","),
                              );
                              setValue(
                                "fee",
                                roleMember
                                  .filter((data) => data.id === roleMemberId)
                                  .map((data) =>
                                    data.level
                                      .filter((data) => data.id === levelId)
                                      .map((data) => data.fee)
                                      .join(","),
                                  )
                                  .join(","),
                              );
                              countTotal();
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
                        <div className="grid w-full gap-3">
                          <Label htmlFor="period">Position</Label>
                          <Input
                            id="position"
                            type="text"
                            disabled
                            value={position}
                            placeholder="e.g Illustrator Designer"
                            required
                            onChange={(range) => {
                              field.onChange(range);
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
                      <div className="grid w-full gap-3">
                        <Label htmlFor="period">Period</Label>
                        <DateRangePicker
                          mode="range"
                          onChange={(range) => {
                            field.onChange(range);
                            // setPeriod(getValues("period"));
                            setPeriodFrom(
                              format(getValues("period").from, FORMAT_DATE),
                            );
                            setPeriodTo(
                              getValues("period").to
                                ? format(getValues("period").to, FORMAT_DATE)
                                : "",
                            );
                          }}
                        />
                      </div>
                    )}
                  />
                  <div className="flex w-full flex-col gap-3 md:flex-row">
                    <Controller
                      control={control}
                      name="levelId"
                      render={({ field }) => (
                        <div className="grid w-full gap-3">
                          <Label htmlFor="levelId">Level</Label>
                          <Input
                            id="levelId"
                            type="text"
                            placeholder="e.g Junior 1"
                            required
                            disabled
                            value={level}
                            onChange={(range) => {
                              field.onChange(range);
                            }}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="fee"
                      render={({ field }) => (
                        <div className="grid w-full gap-3">
                          <Label htmlFor="fee">Fee</Label>
                          <MoneyInput
                            id="fee"
                            currency={"Rp."}
                            placeholder="Input Nominal"
                            value={fee}
                            disabled
                            // @ts-ignore
                            onValueChange={(value) => field.onChange(fee)}
                            onInput={(value) => {
                              field.onChange(fee);
                              countTotal();
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-3 md:flex-row">
                    <Controller
                      control={control}
                      name="presence"
                      render={({ field }) => (
                        <div className="grid w-full gap-3">
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
                                getValues("presence") * 25000,
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
                        <div className="grid w-full gap-3">
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

                  {additionalFee.map((input, index) => {
                    return (
                      <div
                        key={index}
                        className="flex w-full flex-col items-end gap-3 md:flex-row"
                      >
                        <div className="grid w-full gap-3">
                          <div className="flex items-end gap-2">
                            <Label htmlFor="name">Name</Label>
                          </div>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Input Name"
                            defaultValue={input.name}
                            autoComplete="off"
                            // @ts-ignore
                            onChange={(e) => {
                              countTotal();
                              const name = "name";
                              const event = e.target.value;
                              handleFormChange(index, event, name);
                            }}
                            //@ts-ignore
                            // onChange={(event) => handleFormChange(index, event)}
                          />
                        </div>
                        <div className="grid w-full gap-3">
                          <div className="flex items-end gap-2">
                            <Label htmlFor="fee">Amount</Label>
                          </div>
                          <MoneyInput
                            id="fee"
                            name="fee"
                            currency={"Rp."}
                            defaultValue={input.fee}
                            // @ts-ignore
                            onValueChange={(event) => {
                              countTotal();
                              const name = "fee";
                              handleFormChange(index, event, name);
                            }}
                            //@ts-ignore
                            onChange={(event) => countTotal()}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeFields(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={addFields}
                  >
                    Add more
                  </Button>

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
          <div className="flex w-full items-center justify-start gap-2">
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
                  additionalFee={additionalFee}
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
          className="h-[20rem] w-full rounded-lg md:h-[36rem] lg:w-[30rem] xl:h-[54rem] xl:w-[36rem]"
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
            additionalFee={additionalFee}
            totalFee={totalFee}
          />
        </PDFViewer>
      </div>
    </div>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
};

export default CreatePayslip;
