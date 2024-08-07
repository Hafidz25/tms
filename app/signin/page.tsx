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
import { signIn } from "next-auth/react";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR from "swr";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, register, handleSubmit, getValues } = useForm();
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
    // console.log(getValues("password"));

    try {
      const signInData = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInData?.error) {
        setIsLoading(false);
        toast.error(signInData.error);
      } else {
        toast.success("Sign in successfully.");
        Router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitData)} className="grid gap-4">
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
              variant="gooeyLeft"
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
                "Sign in"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Dont have an account?&nbsp;
            <Link href="/signup">
              <Button
                variant="linkHover2"
                className="p-0 after:w-full font-normal"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
