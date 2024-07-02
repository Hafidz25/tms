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
import generator from "generate-password";
import { SpokeSpinner } from "@/components/ui/spinner";

const Page = () => {
  const { control, register, handleSubmit, getValues, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  function generatePass() {
    const password = generator.generate({
      length: 8,
      numbers: true,
    });
    setValue("password", password);
  }

  const handleSubmitData = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("User created successfully.");
        Router.push("/dashboard/users");
      } else if (response.status === 409) {
        setIsLoading(false);
        toast.warning("User with this email already exists.");
      }
      return response;
    } catch (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="" onClick={() => Router.back()}>
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>User Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="name"
                          placeholder="Input Name"
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
                    name="email"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
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
                    name="password"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <div className="flex gap-3">
                          <Input
                            required
                            minLength={6}
                            id="password"
                            placeholder="Input Password"
                            onChange={(range) => {
                              field.onChange(range);
                            }}
                            value={getValues("password")}
                          />
                          <Button
                            size="sm"
                            type="button"
                            onClick={generatePass}
                            variant="shine"
                          >
                            Generate
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>User Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="status">Role</Label>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select role..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Customer Service">
                              Customer Service
                            </SelectItem>
                            <SelectItem value="Team Member">
                              Team Member
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
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
        </div>
      </form>
    </div>
  );
};

export default Page;
