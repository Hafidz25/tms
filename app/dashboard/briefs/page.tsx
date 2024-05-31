"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Brief {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: {
    from: string;
    to: string;
  };
  assign: [
    {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  ];
  feedback: [];
  createdAt: string;
}

const Page = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [load, setLoad] = useState(false);
  const { toast } = useToast();
  const Router = useRouter();

  useEffect(() => {
    fetch("/api/briefs")
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
        setLoad(true);
      });
  }, []);

  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/briefs/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Brief deleted successfully.",
        });
        // Router.refresh();
        location.reload();
      } else if (response.status === 403) {
        toast({
          title: "Error",
          description: "You dont have access.",
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
    <div className="flex flex-1 flex-col min-h-screen w-full gap-4 p-4 md:gap-8 md:p-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="done" className="hidden sm:flex">
              Done
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/dashboard/briefs/create">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Brief
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Briefs</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Assign
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Deadline
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {briefs.map((data, i) => (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">
                          {data.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{data.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {data.assign.map((user) => user.name).join(", ")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {data.deadline.to}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {data.createdAt}
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
                              <DropdownMenuItem>Detail</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
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
                                        {data.title}
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
                Showing <strong>1-10</strong> of <strong>32</strong> briefs
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="assigned">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Briefs</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Assign
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Deadline
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {briefs
                      .filter((data) => data.status === "Assigned")
                      .map((data, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {data.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{data.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.assign.map((user) => user.name).join(", ")}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.deadline.to}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.createdAt}
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
                                <DropdownMenuItem>Detail</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
                Showing <strong>1-10</strong> of <strong>32</strong> briefs
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="in_progress">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Briefs</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Assign
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Deadline
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {briefs
                      .filter((data) => data.status === "In Progress")
                      .map((data, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {data.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{data.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.assign.map((user) => user.name).join(", ")}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.deadline.to}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.createdAt}
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
                                <DropdownMenuItem>Detail</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
                Showing <strong>1-10</strong> of <strong>32</strong> briefs
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="done">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Briefs</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Assign
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Deadline
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {load ? (
                  <TableBody>
                    {briefs
                      .filter((data) => data.status === "Done")
                      .map((data, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {data.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{data.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.assign.map((user) => user.name).join(", ")}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.deadline.to}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {data.createdAt}
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
                                <DropdownMenuItem>Detail</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
                Showing <strong>1-10</strong> of <strong>32</strong> briefs
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
