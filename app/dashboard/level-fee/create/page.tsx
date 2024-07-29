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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SpokeSpinner } from "@/components/ui/spinner";
import { MoneyInput } from "@/components/ui/money-input";
import { toInteger, toNumber } from "lodash-es";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const CreatePayslip = () => {
  const { control, register, handleSubmit, getValues, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const handleSubmitData = async (data: any) => {
    const newData = {
      level: data.level,
      regularFee: toNumber(data.regularFee),
    };
    // console.log(newData);
    setIsLoading(true);
    try {
      const response = await fetch("/api/level-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("Level created successfully.");
        setIsLoading(false);
        Router.push("/dashboard/level-fee");
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 p-4 md:gap-4 md:p-8">
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="grid w-[48rem] flex-1 auto-rows-max gap-4"
      >
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
              <CardTitle>Create Level</CardTitle>
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
                        onChange={(range) => {
                          field.onChange(range);
                        }}
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
                        // @ts-ignore
                        onValueChange={(value) => {
                          field.onChange(value);
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
              "Create level"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePayslip;
