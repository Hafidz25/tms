import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { createUser, SUPER_ACCOUNT } from "@/data/user";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShareDialog from "@/components/custom/ShareDialog";
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

const TAB_LIST = ["All", "Admin", "Customer Service", "Team Member"];
const TABLE_CONTENT = ["Name", "Email", "Role", "Action"];
const TABLE_CONTENT_ROLE = [...TAB_LIST].map((role) => {
  if (role === "All") return "Default";
  return role;
});

function SelectRole(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
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
        <DropdownMenuItem>Delete</DropdownMenuItem>
        <DropdownMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <Link href="" className="w-full">
                Share
              </Link>
            </DialogTrigger>
            <ShareDialog />
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function fetchPagesData() {
  const AMOUNT_DATA = 4;
  return [...createUser({ amount: AMOUNT_DATA }), { ...SUPER_ACCOUNT }];
}

async function UsersPage() {
  const USERS = await fetchPagesData();

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

          <Link href="/dashboard/users/create">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add User
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

                  <TableBody>
                    {USERS.map((data, ui) => (
                      <TableRow key={ui}>
                        <TableCell className="font-medium">
                          {data.name}
                        </TableCell>
                        <TableCell>{data.email}</TableCell>

                        <TableCell>
                          <SelectRole value={data.role} />
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

export default UsersPage;
