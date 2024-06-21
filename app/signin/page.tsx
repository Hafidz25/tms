"use client";
import React, { useEffect, useState } from "react";
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
import { ToastAction } from "@/components/ui/toast";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { SpokeSpinner } from "@/components/ui/spinner";

const Page = () => {
  const [auth, setAuth] = useState(null);
  const [authLoad, setAuthLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Router = useRouter();

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setAuth(data.authenticated);
        setAuthLoad(true);
      });
  }, []);

  if (authLoad) {
    if (auth) {
      Router.push("/dashboard");
    }
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const signInData = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (signInData?.error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.");
    } else {
      toast.success("Sign in successfully.");
      Router.push("/dashboard");
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
          <form onSubmit={submitData} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Input Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
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
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
