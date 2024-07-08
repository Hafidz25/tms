"use client";
import React, { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Fragment } from "react";

import Link from "next/link";
import { FileDown, MoreHorizontal, PlusCircle } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { BriefsStatus } from "@/types/briefs";
import { Roles, User } from "@/types/user";
import { SpokeSpinner } from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import { getMonth } from "date-fns";
import { BriefsTable } from "@/components/data-grid/briefs";
import { ColumnDef } from "@tanstack/react-table";

interface Brief {
  id: string;
  title: string;
  description: string;
  status: string;
  authorId: string;
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

interface DropdownMenuActionsProps
  extends React.ComponentProps<typeof DropdownMenu> {
  /**
   * Single Data Id.
   * Id ini digunakan untuk melakukan aksi pada data tersebut
   */
  targetId: string;
  role: Roles | string;

  /**
   * Sumber data yang akan dimutasi / direferesensi,
   * Ketika melakukan action tertentu.
   */
  data?: Brief;
}

// type TabList = ['All', BriefsStatus];

const TAB_LIST = [
  "All",
  "Assigned",
  "In Review",
  "Waiting for Client",
  "In Progress",
  "Correction",
  "Need Review",
  "Done",
];
const TABLE_CONTENT = ["Title", "Status", "Assign", "Deadline", "Action"];
const FORMAT_DATE = "dd LLL, y";
const CURRENT_SEGMENT_ROUTE = "/dashboard/briefs";

function DeadlineFormat({ date }: { date: DateRange | undefined }) {
  if (!date) return "-";

  return (
    <Fragment>
      {date.from ? format(date.from, FORMAT_DATE) : ""}
      {date.to ? ` - ${format(date.to, FORMAT_DATE)}` : ""}
    </Fragment>
  );
}

function DropdownMenuActions({
  targetId,
  data,
  role,
  ...props
}: DropdownMenuActionsProps) {
  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/briefs/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Brief deleted successfully.");
        // Router.refresh();
        location.reload();
      } else if (response.status === 403) {
        toast.warning("You dont have access.");
      }
      return response;
    } catch (error) {
      toast.error("Uh oh! Something went wrong.");
    }
  };
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            href={CURRENT_SEGMENT_ROUTE + `/${targetId}`}
            className="w-full"
          >
            Detail
          </Link>
        </DropdownMenuItem>
        {role === "Admin" || role === "Customer Service" ? (
          <>
            <DropdownMenuItem>
              <Link
                href={CURRENT_SEGMENT_ROUTE + `/edit/${targetId}`}
                className="w-full"
              >
                Edit
              </Link>
            </DropdownMenuItem>
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
                      Are you sure to delete data &quot;{data?.title}
                      &quot;?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button type="reset" variant="outline">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => handleDelete(targetId)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Page = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [load, setLoad] = useState(false);
  const [userExist, setUserExist] = useState<User>();
  const [loadSession, setLoadSession] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    fetch("/api/briefs")
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
        setLoad(true);
      });
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
      });
    fetch(`/api/auth/session`)
      .then((response) => response.json())
      .then((data) => {
        setUserExist(data.user);
        setLoadSession(true);
      });
  }, []);

  return load && loadSession ? (
    userExist?.role === "Admin" ? (
      <DashboardPanel>
        <BriefsTable data={briefs} />
      </DashboardPanel>
    ) : userExist?.role === "Customer Service" ? (
      <DashboardPanel>
        <BriefsTable
          data={briefs.filter((data) => data.authorId === userExist.id)}
        />
      </DashboardPanel>
    ) : (
      <DashboardPanel>
        <BriefsTable
          data={briefs.filter((data) =>
            data.assign.find(({ id }) => id === userExist?.id)
          )}
        />
      </DashboardPanel>
    )
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
};

export default Page;
