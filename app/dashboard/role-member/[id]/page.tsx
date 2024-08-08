"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeft, Eye, Pen, Pencil, Trash2 } from "lucide-react";

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
import useSWR, { mutate } from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { SpokeSpinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toNumber } from "lodash-es";

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

const formatCurrency = (number: any) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

function MenuAction({ data, roleMember, params }: any) {
  const { control, register, handleSubmit, watch, resetField } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [modalEditLevel, setModalEditLevel] = useState(false);

  const handleEditLevel = async (data: any) => {
    const levelData = roleMember?.level.filter(
      (level: { id: any }) => level.id === data.levelId,
    )[0];
    const newData = {
      name: data.name ? data.name : levelData.name,
      fee: data.fee ? toNumber(data.fee) : toNumber(levelData.fee),
    };
    setIsLoading(true);
    try {
      const response = await fetch(`/api/level/${data.levelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Level updated successfully.");
        setIsLoading(false);
        // location.assign(`/dashboard/role-member`);
        mutate(`/api/role-member/${params.id}`);
        setModalEditLevel(false);
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

  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/level/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Level deleted successfully.");
        mutate(`/api/role-member/${params.id}`);
      }
      return response;
    } catch (error) {
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={modalEditLevel} onOpenChange={setModalEditLevel}>
        <DialogTrigger asChild>
          <Pencil className="h-4 w-4 cursor-pointer text-slate-400 transition duration-300 hover:text-slate-700" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit level</DialogTitle>
            <DialogDescription>
              Make changes to your level here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditLevel)}>
            <input
              type="hidden"
              {...register("levelId", {
                value: data?.id,
              })}
            />
            <div className="grid gap-4 py-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      required
                      defaultValue={data.name}
                      placeholder="e.g Junior 1"
                      className="col-span-3"
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="fee"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fee" className="text-right">
                      Fee
                    </Label>
                    <MoneyInput
                      id="fee"
                      required
                      currency={"Rp."}
                      className="col-span-3"
                      defaultValue={data.fee}
                      // @ts-ignore
                      onValueChange={(value) => field.onChange(value)}
                      onInput={(value) => field.onChange(value)}
                    />
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Trash2 className="h-4 w-4 cursor-pointer text-slate-400 transition duration-300 hover:text-red-500" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete data</DialogTitle>
            <DialogDescription>
              Are you sure to delete data &quot;{data.name}
              &quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="reset" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => handleDelete(data.id)}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DetailRole({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit, watch, resetField } = useForm();

  const [title, setTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalAddLevel, setModalAddLevel] = useState(false);
  const [modalEditLevel, setModalEditLevel] = useState(false);

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: roleMember, error } = useSWR<RoleMember, Error>(
    `/api/role-member/${params.id}`,
    fetcher,
  );

  const handleSubmitData = async (data: any) => {
    const newData = {
      name: data.name ? data.name : roleMember?.name,
    };
    // console.log(data);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/role-member/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Role member updated successfully.");
        setIsLoading(false);
        // location.assign(`/dashboard/role-member`);
        mutate(`/api/role-member/${params.id}`);
        setEditMode(false);
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

  const handleSubmitLevel = async (data: any) => {
    const newData = {
      name: data.name,
      fee: toNumber(data.fee),
      roleId: params.id,
    };
    // console.log(newData);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/level`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success("Level created successfully.");
        setIsLoading(false);
        // location.assign(`/dashboard/role-member`);
        mutate(`/api/role-member/${params.id}`);
        setModalAddLevel(false);
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

  // console.log(payslips);

  return roleMember ? (
    <Fragment>
      <title>
        {editMode
          ? `Edit Role - Task Management System`
          : "Detail Role - Task Management System"}
      </title>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-4 md:gap-4 md:p-8">
        {editMode ? (
          <form
            onSubmit={handleSubmit(handleSubmitData)}
            className="grid w-full flex-1 auto-rows-max gap-4 md:w-[32rem] lg:w-[48rem]"
          >
            <div className="flex w-full items-center justify-between md:w-[32rem] lg:w-[48rem]">
              <Link href="/dashboard/role-member">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
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
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Edit Role Member</CardTitle>
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
                            defaultValue={roleMember.name}
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
                    "Update role"
                  )}
                </Button>
              ) : null}
            </div>
          </form>
        ) : (
          <div className="grid w-full flex-1 auto-rows-max gap-4 md:w-[32rem] lg:w-[48rem]">
            <div className="flex w-full items-center justify-between md:w-[32rem] lg:w-[48rem]">
              <Link href="/dashboard/role-member">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
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
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Detail Role {roleMember.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-2">
                      {/* <div className="text-md font-semibold text-slate-500">
                        List Level
                      </div> */}
                      <div className="flex w-full justify-end">
                        <Dialog
                          open={modalAddLevel}
                          onOpenChange={setModalAddLevel}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm">Add Level</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add level</DialogTitle>
                              <DialogDescription>
                                Create level here. Click add when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleSubmitLevel)}>
                              <div className="grid gap-4 py-4">
                                <Controller
                                  control={control}
                                  name="name"
                                  render={({ field }) => (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="name"
                                        className="text-right"
                                      >
                                        Name
                                      </Label>
                                      <Input
                                        id="name"
                                        required
                                        placeholder="e.g Junior 1"
                                        className="col-span-3"
                                        onChange={(value) => {
                                          field.onChange(value);
                                        }}
                                      />
                                    </div>
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="fee"
                                  render={({ field }) => (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="fee"
                                        className="text-right"
                                      >
                                        Fee
                                      </Label>
                                      <MoneyInput
                                        id="fee"
                                        required
                                        currency={"Rp."}
                                        className="col-span-3"
                                        defaultValue={0}
                                        // @ts-ignore
                                        onValueChange={(value) =>
                                          field.onChange(value)
                                        }
                                        onInput={(value) =>
                                          field.onChange(value)
                                        }
                                      />
                                    </div>
                                  )}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Add level</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roleMember.level.length ? (
                            roleMember.level.map((data, i) => (
                              <TableRow key={i}>
                                <TableCell className="w-1/2 font-medium">
                                  {data.name}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(data.fee)}
                                </TableCell>
                                <TableCell>
                                  <MenuAction
                                    data={data}
                                    roleMember={roleMember}
                                    params={params}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3}>
                                <div className="flex justify-center text-slate-400">
                                  No result
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    "Update role"
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}
