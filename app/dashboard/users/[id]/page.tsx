"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft, Eye, Pen } from "lucide-react";
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
import useSWR from "swr";

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleMemberId: string;
  levelId: string;
}

const DetailUser = ({ params }: { params: { id: string } }) => {
  const { control, watch, handleSubmit, getValues, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);

  const { data: roleMember, error: errorRoleMember } = useSWR<
    RoleMember[],
    Error
  >("/api/role-member", fetcher);

  const { data: user, error: errorUser } = useSWR<User, Error>(
    `/api/users/${params.id}`,
    fetcher,
  );

  //   console.log(user);

  function generatePass() {
    const password = generator.generate({
      length: 8,
      numbers: true,
    });
    setValue("password", password);
  }

  const handleSubmitData = async (data: any) => {
    const newData = {
      name: data.name ? data.name : user?.name,
      email: data.email ? data.email : user?.email,
      role: data.role ? data.role : user?.role,
      roleMemberId: data.roleMember ? data.roleMember : user?.roleMemberId,
      levelId: data.level ? data.level : user?.levelId,
    };
    // console.log(newData);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("User updated successfully.");
        location.assign("/dashboard/users");
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

  return roleMember && user ? (
    <div className="flex min-h-screen w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <title>
        {editMode
          ? `Edit User - Task Management System`
          : "Detail User - Task Management System"}
      </title>
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 lg:min-w-[59rem]"
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="" onClick={() => Router.back()}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          {editMode ? (
            <Button
              variant="outline"
              type="button"
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
              type="button"
              className="flex items-center gap-2"
              onClick={() => setEditMode(true)}
            >
              <Pen className="h-4 w-4" />
              Edit
            </Button>
          )}
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
                          disabled={editMode ? false : true}
                          defaultValue={user.name}
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
                          disabled={editMode ? false : true}
                          defaultValue={user.email}
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
                            type="password"
                            id="password"
                            disabled
                            defaultValue={"12345678"}
                            placeholder="Input Password"
                            onChange={(range) => {
                              field.onChange(range);
                            }}
                            value={getValues("password")}
                          />
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
                        <Label htmlFor="role">Role</Label>
                        <Select
                          disabled={editMode ? false : true}
                          defaultValue={user.role}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger id="role" aria-label="Select status">
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
                  <Controller
                    control={control}
                    name="roleMember"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="roleMember">Role Member</Label>
                        <Select
                          disabled={editMode ? false : true}
                          defaultValue={user.roleMemberId}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger
                            id="roleMember"
                            aria-label="Select role member"
                          >
                            <SelectValue placeholder="Select role member..." />
                          </SelectTrigger>
                          <SelectContent>
                            {roleMember.map((data) => (
                              <SelectItem value={data.id}>
                                {data.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <Label htmlFor="level">Level</Label>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          disabled={editMode ? false : true}
                          defaultValue={user.levelId}
                        >
                          <SelectTrigger id="level" aria-label="Select level">
                            <SelectValue placeholder="Select level..." />
                          </SelectTrigger>
                          <SelectContent>
                            {roleMember
                              .filter((data) =>
                                watch("roleMember")
                                  ? data.id === watch("roleMember")
                                  : data.id === user.roleMemberId,
                              )
                              .map((data) =>
                                data.level.map((data) => (
                                  <SelectItem value={data.id}>
                                    {data.name}
                                  </SelectItem>
                                )),
                              )}
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
                "Save changes"
              )}
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
};

export default DetailUser;
