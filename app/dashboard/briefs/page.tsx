import React, { useEffect, useState } from "react";

import Link from "next/link";
import { Fragment } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { createBriefs } from "@/data/briefs";
import { createUser } from "@/data/user";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
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

const TAB_LIST = ["All", "Assigned", "In Progress", "Done"];
const TABLE_CONTENT = ["Title", "Status", "Deadline", "Created At", "Action"];
const FORMAT_DATE = "LLL dd, y";

async function fetchPagesData() {
  const BRIEFS = await fetch("http://localhost:3000/api/briefs");
  return BRIEFS.json();
}

function DeadlineFormat({ date }: { date: DateRange | undefined }) {
  if (!date) return "-";

  return (
    <Fragment>
      {date.from ? format(date.from, FORMAT_DATE) : ""}
      {date.to ? `- ${format(date.to, FORMAT_DATE)}` : ""}
    </Fragment>
  );
}

function DropdownMenuActions(props: React.ComponentProps<typeof DropdownMenu>) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Detail</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

async function BriefPage() {
  const briefs = await fetchPagesData();
  console.log(briefs);

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

                  <TableBody>
                    {briefs.data.map((brief, bid) => (
                      <TableRow key={bid}>
                        <TableCell className="font-medium">
                          {brief.title}
                        </TableCell>

                        <TableCell>
                          <Badge variant={"outline"}>{brief.status}</Badge>
                        </TableCell>

                        <TableCell>
                          <DeadlineFormat date={brief.deadline} />
                        </TableCell>

                        <TableCell>
                          {format(brief.createdAt, FORMAT_DATE)}
                        </TableCell>

                        <TableCell>
                          <DropdownMenuActions />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardPanel>
  );
}

export default BriefPage;
