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
  name: string;
  period: {
    from: string;
    to: string;
  };
  regularFee: number;
  presence: number;
  transportFee: number;
  additionalFee: [
    {
      name: string;
      fee: number;
    },
  ];
  totalFee: number;
  createdAt: string;
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleMemberId: string;
  levelId: string;
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
  const [additionalFee, setAdditionalFee] = useState<AdditionalFee[]>([]);

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
    fetcher,
  );
  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher,
  );
  const { data: roleMember, error: roleError } = useSWR<RoleMember[], Error>(
    "/api/role-member",
    fetcher,
  );

  // console.log(
  //   ,
  // );

  const countTotal = () => {
    setTotalFee(
      (getValues("fee") ? toNumber(getValues("fee")) : 0) +
        (getValues("transportFee") ? getValues("transportFee") : 0) +
        additionalFee.reduce(function (s, a) {
          return s + toNumber(a.fee);
        }, 0),
    );
  };

  const formatMonth = payslips?.period.to
    ? format(payslips?.period.to, "LLLL", { locale: id })
    : "";

  // console.log(payslips);

  const handleSubmitData = async (data: any) => {
    const newData = {
      userId: data.userId ? data.userId : payslips?.userId,
      period: data.period ? data.period : payslips?.period,
      fee: data.fee ? toNumber(data.fee) : toNumber(payslips?.regularFee),
      presence: data.presence
        ? toNumber(data.presence)
        : toNumber(payslips?.presence),
      transportFee: data.presence
        ? toNumber(data.presence) * 25000
        : toNumber(payslips?.transportFee),
    };

    const totalData = {
      userId: newData.userId,
      period: newData.period,
      regularFee: newData.fee,
      presence: newData.presence,
      transportFee: newData.transportFee,
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

  return payslips && users && roleMember && formatMonth ? (
    <Fragment>
      <title>
        {editMode
          ? `Edit Payslip - Task Management System`
          : "Detail Payslip - Task Management System"}
      </title>
      <div className="flex min-h-screen w-full flex-col justify-center gap-4 p-4 md:gap-4 md:p-8">
        <div className="flex w-full items-center justify-between gap-4 self-center lg:w-[73rem]">
          <Link href="/dashboard/payslips">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          {/* {editMode ? (
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
          )} */}
        </div>
        <div className="flex w-full flex-col justify-center gap-4 md:gap-4 lg:flex-row">
          <form
            onSubmit={handleSubmit(handleSubmitData)}
            className="grid w-full flex-1 auto-rows-max gap-4 lg:max-w-[36rem]"
          >
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>{editMode ? "Edit" : "Detail"} Payslip</CardTitle>
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
                                setPosition(
                                  roleMember
                                    ?.filter(
                                      (data) =>
                                        data.id ===
                                        users
                                          ?.filter(
                                            (user) =>
                                              user.id === getValues("userId"),
                                          )
                                          .map((user) => user.roleMemberId)
                                          .join(", "),
                                    )
                                    .map((data) => data.name)
                                    .join(","),
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
                                    (user) => user.role === "Team Member",
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
                          <div className="grid w-full gap-3">
                            <Label htmlFor="period">Position</Label>
                            <Input
                              id="position"
                              type="text"
                              disabled
                              value={roleMember
                                ?.filter(
                                  (data) =>
                                    data.id ===
                                    users
                                      ?.filter(
                                        (user) => user.id === payslips?.userId,
                                      )
                                      .map((user) => user.roleMemberId)
                                      .join(", "),
                                )
                                .map((data) => data.name)
                                .join(",")}
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
                            // setValue={{
                            //   //@ts-ignore
                            //   from: editMode
                            //     ? periodFrom
                            //     : payslips.period.from,
                            //   //@ts-ignore
                            //   to: editMode ? periodTo : payslips.period.to,
                            // }}
                            disabled={editMode ? false : true}
                            onChange={(range) => {
                              field.onChange(range);
                              // setPeriod(getValues("period"));
                              setPeriodFrom(
                                getValues("period")?.from
                                  ? format(
                                      getValues("period").from,
                                      FORMAT_DATE,
                                    )
                                  : "",
                              );
                              setPeriodTo(
                                getValues("period")?.to
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
                              value={roleMember
                                ?.filter(
                                  (data) =>
                                    data.id ===
                                    users
                                      ?.filter(
                                        (user) => user.id === payslips?.userId,
                                      )
                                      .map((user) => user.roleMemberId)
                                      .join(", "),
                                )
                                .map((data) =>
                                  data.level
                                    .filter(
                                      (data) =>
                                        data.id ===
                                        users
                                          ?.filter(
                                            (user) =>
                                              user.id === payslips?.userId,
                                          )
                                          .map((user) => user.levelId)
                                          .join(", "),
                                    )
                                    .map((data) => data.name)
                                    .join(","),
                                )}
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
                              value={roleMember
                                ?.filter(
                                  (data) =>
                                    data.id ===
                                    users
                                      ?.filter(
                                        (user) => user.id === payslips?.userId,
                                      )
                                      .map((user) => user.roleMemberId)
                                      .join(", "),
                                )
                                .map((data) =>
                                  data.level
                                    .filter(
                                      (data) =>
                                        data.id ===
                                        users
                                          ?.filter(
                                            (user) =>
                                              user.id === payslips?.userId,
                                          )
                                          .map((user) => user.levelId)
                                          .join(", "),
                                    )
                                    .map((data) => data.fee)
                                    .join(","),
                                )}
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
                              disabled={editMode ? false : true}
                              defaultValue={payslips.presence}
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
                    {payslips.additionalFee.map((input, index) => {
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
                              disabled
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
                              disabled
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
                      position={roleMember
                        ?.filter(
                          (data) =>
                            data.id ===
                            users
                              ?.filter((user) => user.id === payslips?.userId)
                              .map((user) => user.roleMemberId)
                              .join(", "),
                        )
                        .map((data) => data.name)
                        .join(",")}
                      level={roleMember
                        ?.filter(
                          (data) =>
                            data.id ===
                            users
                              ?.filter((user) => user.id === payslips?.userId)
                              .map((user) => user.roleMemberId)
                              .join(", "),
                        )
                        .map((data) =>
                          data.level
                            .filter(
                              (data) =>
                                data.id ===
                                users
                                  ?.filter(
                                    (user) => user.id === payslips?.userId,
                                  )
                                  .map((user) => user.levelId)
                                  .join(", "),
                            )
                            .map((data) => data.name)
                            .join(","),
                        )}
                      periodTo={format(payslips.period.to, FORMAT_DATE)}
                      periodFrom={format(payslips.period.from, FORMAT_DATE)}
                      fee={payslips.regularFee}
                      presence={payslips.presence}
                      transportFee={payslips.transportFee}
                      additionalFee={payslips.additionalFee}
                      totalFee={payslips.totalFee}
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
            className="h-[20rem] w-full rounded-lg md:h-[36rem] lg:w-[30rem] xl:h-[54rem] xl:w-[36rem]"
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
                additionalFee={payslips.additionalFee}
                totalFee={totalFee}
              />
            ) : (
              <PayslipPdf
                name={users
                  ?.filter((user) => user.id === payslips.userId)
                  .map((user) => user.name)}
                position={roleMember
                  ?.filter(
                    (data) =>
                      data.id ===
                      users
                        ?.filter((user) => user.id === payslips?.userId)
                        .map((user) => user.roleMemberId)
                        .join(", "),
                  )
                  .map((data) => data.name)
                  .join(",")}
                level={roleMember
                  ?.filter(
                    (data) =>
                      data.id ===
                      users
                        ?.filter((user) => user.id === payslips?.userId)
                        .map((user) => user.roleMemberId)
                        .join(", "),
                  )
                  .map((data) =>
                    data.level
                      .filter(
                        (data) =>
                          data.id ===
                          users
                            ?.filter((user) => user.id === payslips?.userId)
                            .map((user) => user.levelId)
                            .join(", "),
                      )
                      .map((data) => data.name)
                      .join(","),
                  )}
                periodTo={format(payslips.period.to, FORMAT_DATE)}
                periodFrom={format(payslips.period.from, FORMAT_DATE)}
                fee={payslips.regularFee}
                presence={payslips.presence}
                transportFee={payslips.transportFee}
                additionalFee={payslips.additionalFee}
                totalFee={payslips.totalFee}
              />
            )}
          </PDFViewer>
        </div>
      </div>
      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}
