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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const CreateRole = () => {
  const { control, register, handleSubmit, getValues, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const handleSubmitData = async (data: any) => {
    const newData = {
      name: data.name,
    };
    // console.log(newData);
    setIsLoading(true);
    try {
      const response = await fetch("/api/role-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("Role member created successfully.");
        setIsLoading(false);
        Router.push("/dashboard/role-member");
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-4 md:gap-4 md:p-8">
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="grid w-[48rem] flex-1 auto-rows-max gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard/role-member">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Create Role Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <div className="grid w-full gap-3">
                      <Label htmlFor="period">Role Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g Illustrator"
                        required
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
              "Create role"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;
