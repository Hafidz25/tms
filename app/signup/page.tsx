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
import { useToast } from "@/components/ui/use-toast";
import { SpokeSpinner } from "@/components/ui/spinner";

const Page = () => {
  const [auth, setAuth] = useState(null);
  const [authLoad, setAuthLoad] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const { toast } = useToast();

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
    try {
      const body = { name, email, password };
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // console.log(response);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "User created successfully.",
        });
        Router.push("/signin");
      } else if (response.status === 409) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "User with this email already exists.",
          variant: "destructive",
        });
      }
      return response;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
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
          <form onSubmit={submitData} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Input Name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
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
                "Create an account"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?&nbsp;
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
