"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Copy } from "lucide-react";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Navbar from "@/components/custom/Navbar";
import generator from "generate-password";
import ShareDialog from "@/components/custom/ShareDialog";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const Router = useRouter();
  const { toast } = useToast();

  function generatePass() {
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    setPassword(password);
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { name, email, password, role };
      // console.log(body);
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
        // Router.push("/users");
      } else if (response.status === 409) {
        toast({
          title: "Error",
          description: "User with this email already exists.",
          variant: "destructive",
        });
      }
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
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
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      placeholder="Input Name"
                      required
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      className="w-full"
                      placeholder="Input Email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex gap-3">
                      <Input
                        id="password"
                        type="text"
                        className="w-full"
                        placeholder="Input Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button size="sm" onClick={generatePass}>
                        Generate
                      </Button>
                    </div>
                  </div>
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
                  <div className="grid gap-3">
                    <Label htmlFor="status">Role</Label>
                    <Select
                      defaultValue="Default"
                      onValueChange={(value) => setRole(value)}
                    >
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Default">Default</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Customer Service">
                          Customer Service
                        </SelectItem>
                        <SelectItem value="Team Member">Team Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <Button type="submit" size="sm">
            Add User
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Share
              </Button>
            </DialogTrigger>
            <ShareDialog name={name} password={password} />
          </Dialog>
        </div>
      </form>
    </div>
  );
};

export default Page;
