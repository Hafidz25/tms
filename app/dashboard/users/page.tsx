"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { File, MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import Navbar from "@/components/custom/Navbar";
import ShareDialog from "@/components/custom/ShareDialog";
import { userList } from "@/app/constants/userList";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [load, setLoad] = useState(false);
  const { toast } = useToast();
  const Router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        setLoad(true);
      });
  }, []);

  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/users/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json)
        .then((data) => {
          location.reload();
          // Router.refresh()
          toast({
            title: "Success",
            description: "User deleted successfully.",
          });
        });
      // console.log(response);

      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
    }
  };

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
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
        Router.refresh();
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
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="cs">Customer Service</TabsTrigger>
            <TabsTrigger value="tm" className="hidden sm:flex">
              Team Member
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/dashboard/users/create">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add User
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {users.map((data, i) => (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">
                          {data.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {data.email}
                        </TableCell>
                        <TableCell>
                          <div className="w-[100%] lg:w-[60%] xl:w-[35%]">
                            <Select
                              defaultValue={data.role}
                              onValueChange={(value) =>
                                updateRole(
                                  data.id,
                                  value,
                                  data.name,
                                  data.email
                                )
                              }
                            >
                              <SelectTrigger
                                id="status"
                                aria-label="Select status"
                              >
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Default">Default</SelectItem>
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
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Link href="" className="w-full">
                                      Delete
                                    </Link>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Delete data</DialogTitle>
                                      <DialogDescription>
                                        Are you sure to delete data '{data.name}
                                        '?
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
                              <DropdownMenuItem>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Link href="" className="w-full">
                                      Share
                                    </Link>
                                  </DialogTrigger>
                                  <ShareDialog
                                    email={data.email}
                                    password={"data.password"}
                                  />
                                </Dialog>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {users
                      .filter((data) => data.role === "Admin")
                      .map((data, i) => (
                        <TableRow key={data.id}>
                          <TableCell className="font-medium">
                            {data.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.email}
                          </TableCell>
                          <TableCell>
                            <div className="w-[100%] lg:w-[60%] xl:w-[35%]">
                              <Select defaultValue={data.role}>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Default">
                                    Default
                                  </SelectItem>
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
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Link href="" className="w-full">
                                        Delete
                                      </Link>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Delete data</DialogTitle>
                                        <DialogDescription>
                                          Are you sure to delete data '
                                          {data.name}
                                          '?
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
                                <DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Link href="" className="w-full">
                                        Share
                                      </Link>
                                    </DialogTrigger>
                                    <ShareDialog
                                      email={data.email}
                                      password={"data.password"}
                                    />
                                  </Dialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                ) : null}
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="cs">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {users
                      .filter((data) => data.role === "Customer Service")
                      .map((data, i) => (
                        <TableRow key={data.id}>
                          <TableCell className="font-medium">
                            {data.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.email}
                          </TableCell>
                          <TableCell>
                            <div className="w-[100%] lg:w-[60%] xl:w-[35%]">
                              <Select defaultValue={data.role}>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Default">
                                    Default
                                  </SelectItem>
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
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Link href="" className="w-full">
                                        Delete
                                      </Link>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Delete data</DialogTitle>
                                        <DialogDescription>
                                          Are you sure to delete data '
                                          {data.name}
                                          '?
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
                                <DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Link href="" className="w-full">
                                        Share
                                      </Link>
                                    </DialogTrigger>
                                    <ShareDialog
                                      email={data.email}
                                      password={"data.password"}
                                    />
                                  </Dialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                ) : null}
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="tm">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {users
                      .filter((data) => data.role === "Team Member")
                      .map((data, i) => (
                        <TableRow key={data.id}>
                          <TableCell className="font-medium">
                            {data.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.email}
                          </TableCell>
                          <TableCell>
                            <div className="w-[100%] lg:w-[60%] xl:w-[35%]">
                              <Select defaultValue={data.role}>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Default">
                                    Default
                                  </SelectItem>
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
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Link href="" className="w-full">
                                        Delete
                                      </Link>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Delete data</DialogTitle>
                                        <DialogDescription>
                                          Are you sure to delete data '
                                          {data.name}
                                          '?
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
                                <DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Link href="" className="w-full">
                                        Share
                                      </Link>
                                    </DialogTrigger>
                                    <ShareDialog
                                      email={data.email}
                                      password={"data.password"}
                                    />
                                  </Dialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                ) : null}
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> users
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
