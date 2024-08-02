"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft } from "lucide-react";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";

interface LevelFee {
  id: string;
  level: number;
  regularFee: number;
}

export default function DetailLevel({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit, watch, resetField } = useForm();

  const [title, setTitle] = useState(null);

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: level, error } = useSWR<LevelFee, Error>(
    `/api/level-fee/${params.id}`,
    fetcher
  );

  // console.log(payslips);

  return level ? (
    <Fragment>
      <title>
        {title
          ? `${title} - Task Management System`
          : "Detail Level - Task Management System"}
      </title>
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 p-4 md:gap-4 md:p-8">
        <form className="grid w-[48rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/level-fee">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Detail Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <div className="grid gap-3 w-full">
                        <Label htmlFor="period">Level Name</Label>
                        <Input
                          id="level"
                          type="text"
                          placeholder="e.g Junior 1"
                          required
                          disabled
                          value={level.level}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="regularFee"
                    render={({ field }) => (
                      <div className="grid gap-3 w-full">
                        <Label htmlFor="fee">Fee</Label>
                        <MoneyInput
                          id="fee"
                          currency={"Rp."}
                          placeholder="Input Nominal"
                          disabled
                          value={level.regularFee}
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
              "Create level"
            )}
          </Button> */}
          </div>
        </form>
      </div>
      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
