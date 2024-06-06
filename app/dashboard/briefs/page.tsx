"use client";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";

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
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { BriefsStatus } from "@/types/briefs";
import { Roles, User } from "@/types/user";

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
const TABLE_CONTENT = ["Title", "Status", "Deadline", "Created At", "Action"];
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
  const { toast } = useToast();
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
  const [load, setLoad] = useState(false);
  const [userExist, setUserExist] = useState<User>();
  const [loadSession, setLoadSession] = useState(false);
  const { toast } = useToast();
  const Router = useRouter();

  useEffect(() => {
    fetch("/api/briefs")
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
        setLoad(true);
      });
    fetch(`/api/auth/session`)
      .then((response) => response.json())
      .then((data) => {
        setUserExist(data.user);
        setLoadSession(true);
      });
  }, []);

  return (
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

          <Link href="/dashboard/briefs/create">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Brief
              </span>
            </Button>
          </Link>
        </div>

        {TAB_LIST.map((content, i) => (
          <TabsContent key={content.trim() + i} value={content}>
            <Card>
              <CardHeader>
                <CardTitle>{`${content} Briefs`}</CardTitle>
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

                  {load && loadSession ? (
                    content === "All" ? (
                      <TableBody>
                        {briefs
                          ? briefs.map((brief, bid) => (
                              <TableRow key={bid}>
                                <TableCell className="font-medium">
                                  {brief.title}
                                </TableCell>

                                <TableCell>
                                  <Badge variant={"outline"}>
                                    {brief.status}
                                  </Badge>
                                </TableCell>

                                <TableCell>
                                  {
                                    // @ts-ignore
                                    <DeadlineFormat date={brief.deadline} />
                                  }
                                </TableCell>

                                <TableCell>
                                  {format(brief.createdAt, FORMAT_DATE)}
                                </TableCell>

                                <TableCell>
                                  <DropdownMenuActions
                                    targetId={brief.id}
                                    data={brief}
                                    role={userExist ? userExist.role : ""}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          : null}
                      </TableBody>
                    ) : (
                      <TableBody>
                        {briefs
                          ? briefs
                              .filter((data) => data.status === content)
                              .map((brief, bid) => (
                                <TableRow key={bid}>
                                  <TableCell className="font-medium">
                                    {brief.title}
                                  </TableCell>

                                  <TableCell>
                                    <Badge variant={"outline"}>
                                      {brief.status}
                                    </Badge>
                                  </TableCell>

                                  <TableCell>
                                    {
                                      // @ts-ignore
                                      <DeadlineFormat date={brief.deadline} />
                                    }
                                  </TableCell>

                                  <TableCell>
                                    {format(brief.createdAt, FORMAT_DATE)}
                                  </TableCell>

                                  <TableCell>
                                    <DropdownMenuActions
                                      targetId={brief.id}
                                      data={brief}
                                      role={userExist ? userExist.role : ""}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                          : null}
                      </TableBody>
                    )
                  ) : null}
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardPanel>
  );
};

export default Page;
