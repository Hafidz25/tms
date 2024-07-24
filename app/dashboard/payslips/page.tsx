"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { Eye, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR, { useSWRConfig } from "swr";
import { format } from "date-fns";

const TABLE_CONTENT = ["Name", "Period", "Presence", "Action"];

function DropdownMenuActions({ data }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const { mutate } = useSWRConfig();

  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/payslips/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Payslip deleted successfully.");
        Router.refresh();
        mutate("/api/payslips");
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
          <Link
            onClick={() => setIsLoading(true)}
            href={`payslips/${data.id}`}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <SpokeSpinner size="xs" />
                Loading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Detail
              </div>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
                  Are you sure to delete this data?
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

interface Payslip {
  id: string;
  userId: string;
  period: {
    from: string;
    to: string;
  };
  regularFee: number;
  presence: number;
  transportFee: number;
  thrFee: number;
  otherFee: number;
  totalFee: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const FORMAT_DATE = "dd LLL, y";

function PayslipsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: payslips, error } = useSWR<Payslip[], Error>(
    "/api/payslips",
    fetcher
  );
  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher
  );

  // console.log(payslips);

  return payslips && users ? (
    <DashboardPanel>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center justify-end flex-wrap">
          <Link href="/dashboard/payslips/create">
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
                    Add Payslip
                  </div>
                )}
              </span>
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Data Payslips</CardTitle>
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
              <TableBody>
                {payslips.length !== 0 ? (
                  payslips.map((data, ui) => (
                    <TableRow key={data.id}>
                      <TableCell className="font-medium">
                        {users
                          ?.filter((user) => user.id === data.userId)
                          .map((user) => user.name)}
                      </TableCell>
                      <TableCell>
                        {format(data.period.from, FORMAT_DATE)} -{" "}
                        {format(data.period.to, FORMAT_DATE)}
                      </TableCell>

                      <TableCell>{data.presence} days</TableCell>

                      <TableCell>
                        <DropdownMenuActions data={data} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex justify-center my-4">No result</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
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

export default PayslipsPage;
