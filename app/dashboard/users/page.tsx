"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR, { useSWRConfig } from "swr";

const TAB_LIST = ["All", "Admin", "Customer Service", "Team Member"];
const TABLE_CONTENT = ["Name", "Email", "Role", "Action"];
const TABLE_CONTENT_ROLE = ["Admin", "Customer Service", "Team Member"];

function SelectRole({ data }: any) {
  const Router = useRouter();
  const { mutate } = useSWRConfig();

  const updateRole = async (
    dataId: string,
    role: string,
    name: string,
    email: string
  ) => {
    try {
      const response = await fetch(`/api/users/${dataId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, role: role }),
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("User updated successfully.");
        mutate("/api/users");
        Router.refresh();
      }
      return response;
    } catch (error) {
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return (
    <Select
      defaultValue={data.role}
      onValueChange={(value) =>
        updateRole(data.id, value, data.name, data.email)
      }
    >
      <SelectTrigger id="status" aria-label="Select status">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        {TABLE_CONTENT_ROLE.map((role, i) => (
          <SelectItem key={role.trim() + i} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DropdownMenuActions({ data }: any) {
  const Router = useRouter();
  const { mutate } = useSWRConfig();

  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/users/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("User deleted successfully.");
        Router.refresh();
        mutate("/api/users");
      }
      return response;
    } catch (error) {
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <Link href="" className="w-full flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Link>
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function UsersPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: users, error } = useSWR<User[], Error>("/api/users", fetcher);

  return users ? (
    <DashboardPanel>
      <Tabs defaultValue={TAB_LIST[0]}>
        <div className="flex gap-2 items-center sm:justify-between justify-start flex-wrap">
          <TabsList>
            {TAB_LIST.map((tab, i) => (
              <TabsTrigger key={tab.trim() + i} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <Link href="/dashboard/users/create">
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => setIsLoading(true)}
              disabled={isLoading}
              variant="default"
            >
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <SpokeSpinner size="sm" />
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Add Brief
                  </div>
                )}
              </span>
            </Button>
          </Link>
        </div>

        {TAB_LIST.map((content, i) => (
          <TabsContent key={content.trim() + i} value={content}>
            <Card>
              <CardHeader>
                <CardTitle>{`${content} Users`}</CardTitle>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {TABLE_CONTENT.map((header, i) => (
                        <TableHead key={header.trim() + i}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  {content === "All" ? (
                    <TableBody>
                      {users.length !== 0 ? (
                        users.map((data, ui) => (
                          <TableRow key={data.id}>
                            <TableCell className="font-medium">
                              {data.name}
                            </TableCell>
                            <TableCell>{data.email}</TableCell>

                            <TableCell>
                              <SelectRole data={data} />
                            </TableCell>

                            <TableCell>
                              <DropdownMenuActions data={data} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="flex justify-center my-4">
                              No result
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  ) : (
                    <TableBody>
                      {users.filter((data) => data.role === content).length !==
                      0 ? (
                        users
                          .filter((data) => data.role === content)
                          .map((data, ui) => (
                            <TableRow key={data.id}>
                              <TableCell className="font-medium">
                                {data.name}
                              </TableCell>
                              <TableCell>{data.email}</TableCell>

                              <TableCell>
                                <SelectRole data={data} />
                              </TableCell>

                              <TableCell>
                                <DropdownMenuActions data={data} />
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="flex justify-center my-4">
                              No result
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardPanel>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}

export default UsersPage;
