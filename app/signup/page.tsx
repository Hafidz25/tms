"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR from "swr";

const Page = () => {
  const { control, register, handleSubmit, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.authenticated) {
          Router.push("/dashboard");
          toast.success("You have successfully logged in.");
        }
      });
  const { data: auth, error: usersError } = useSWR("/api", fetcher);

  const submitData = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("User created successfully.");
        Router.push("/signin");
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
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitData)} className="grid gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="Input Name"
                    required
                    minLength={2}
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
                <div className="grid gap-2">
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
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    required
                    minLength={6}
                    id="password"
                    placeholder="Input Password"
                    onChange={(range) => {
                      field.onChange(range);
                    }}
                    value={getValues("password")}
                  />
                </div>
              )}
            />
            <Button
              variant="gooeyRight"
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <SpokeSpinner size="sm" />
                  Loading...
                </div>
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?&nbsp;
            <Link href="/signin">
              <Button
                variant="linkHover2"
                className="p-0 after:w-full font-normal"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
