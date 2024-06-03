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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_LIST = ["All", "Assigned", "In Progress", "Done"];
const TABLE_CONTENT = ["Title", "Status", "Deadline", "Created At", "Action"];
const FORMAT_DATE = "LLL dd, y";

async function fetchPagesData() {
  const AMOUNT_DATA = 10;

  const USERS = [...createUser({ amount: AMOUNT_DATA })];
  const BRIEFS = [
    ...createBriefs({
      amount: AMOUNT_DATA,
      assign: [...USERS],
    }),
  ];

  return {
    users: USERS,
    briefs: BRIEFS,
  };
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

function DeadlineFormat({
  date,
}: {
  date: DateRange | undefined;
}) {
  if (!date) return "-";

  return (
    <Fragment>
      {date.from ? format(date.from, FORMAT_DATE): ''}
      {date.to ? `- ${format(date.to, FORMAT_DATE)}` : ""}
    </Fragment>
  );
}

async function Page() {
  const { briefs } = await fetchPagesData();

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
                    {briefs.map((brief, bid) => (
                      <TableRow key={bid}>
                        <TableCell className="font-medium">
                          {brief.title}
                        </TableCell>

                        <TableCell>
                          <Badge variant={'outline'}>{brief.status}</Badge>
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

export default Page;
