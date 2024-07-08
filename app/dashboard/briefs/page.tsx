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
  const { control, register, handleSubmit } = useForm();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [load, setLoad] = useState(false);
  const [userExist, setUserExist] = useState<User>();
  const [loadSession, setLoadSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const month = [
    {
      value: "0",
      label: "January",
    },
    {
      value: "1",
      label: "February",
    },
    {
      value: "2",
      label: "March",
    },
    {
      value: "3",
      label: "April",
    },
    {
      value: "4",
      label: "May",
    },
    {
      value: "5",
      label: "June",
    },
    {
      value: "6",
      label: "July",
    },
    {
      value: "7",
      label: "August",
    },
    {
      value: "8",
      label: "September",
    },
    {
      value: "9",
      label: "October",
    },
    {
      value: "10",
      label: "November",
    },
    {
      value: "11",
      label: "December",
    },
  ];

  const handleExport = useCallback(
    (data: any) => {
      // console.log(data);
      const briefUser = briefs.filter((user) =>
        user.assign.find(({ id }) => id === data.userId)
      );
      const briefUserbyMonth = briefUser.filter(
        (user) => getMonth(new Date(user.createdAt)).toString() === data.month
      );
      const dataBrief = briefUserbyMonth.map((user) => {
        return {
          Title: user.title,
          Author: users
            .filter((e) => e.id === user.authorId)
            .map((e) => e.name)[0],
          Status: user.status,
          Deadline: `${format(user.deadline.from, FORMAT_DATE)} - ${format(
            user.deadline.to,
            FORMAT_DATE
          )}`,
          CreatedAt: format(user.createdAt, FORMAT_DATE),
        };
      });
      // console.log(dataBrief);

      // Buat work book baru
      const wb = XLSX.utils.book_new();

      // Ubah data menjadi worksheet
      const ws = XLSX.utils.json_to_sheet(dataBrief);

      // Set format kolom
      const wscols = [
        { wch: 30 }, // Lebar kolom A
        { wch: 10 }, // Lebar kolom B
        { wch: 30 }, // Lebar kolom C
        { wch: 30 },
        { wch: 30 },
      ];
      ws["!cols"] = wscols;

      // Set format baris
      const wsrows = [
        { hpx: 20 }, // Tinggi baris
      ];
      ws["!rows"] = wsrows;

      // Set gaya sel
      for (let R = 0; R < dataBrief.length + 1; ++R) {
        for (let C = 0; C < 6; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
          if (!ws[cellAddress]) continue;

          ws[cellAddress].s = {
            font: {
              name: "Arial",
              sz: 12,
              bold: R === 0, // Buat header tebal
              color: { rgb: R === 0 ? "FFFFFF" : "000000" }, // Warna font (putih untuk header)
            },
            fill: {
              fgColor: { rgb: R === 0 ? "4F81BD" : "D3D3D3" }, // Warna latar belakang (biru untuk header, abu-abu untuk lainnya)
            },
            alignment: {
              vertical: "center",
              horizontal: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      // Tambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Simpan workbook sebagai file
      XLSX.writeFile(
        wb,
        `${
          users
            .filter((user) => user.id === data.userId)
            .map((user) => user.name)[0]
        } - ${
          month.filter((m) => m.value === data.month).map((m) => m.label)[0]
        }.xlsx`
      );
    },
    [briefs]
  );

  return load && loadSession ? (
    userExist?.role === "Admin" ? (
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

            <div className="flex gap-1">
              {users.length ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1" variant="outline">
                      <FileDown className="w-4 h-4" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Export data brief</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit(handleExport)}
                      className="grid gap-4 py-4"
                    >
                      <Controller
                        control={control}
                        name="userId"
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                .filter((data) => data.role === "Team Member")
                                .map((data) => (
                                  <SelectItem value={data.id}>
                                    {data.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Controller
                        control={control}
                        name="month"
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              {month.map((data) => (
                                <SelectItem value={data.value}>
                                  {data.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Button type="submit">Export</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : null}
              <Link href="/dashboard/briefs/create">
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => setIsLoading(true)}
                  disabled={isLoading}
                  variant="expandIcon"
                  Icon={PlusCircle}
                  iconStyle="h-4 w-4"
                  iconPlacement="left"
                >
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <SpokeSpinner size="sm" />
                        Loading...
                      </div>
                    ) : (
                      "Add Brief"
                    )}
                  </span>
                </Button>
              </Link>
            </div>
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
                          <TableHead key={header.trim() + i}>
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    {content === "All" ? (
                      <TableBody>
                        {briefs.length !== 0 ? (
                          briefs.map((brief, bid) => (
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
                                {brief.assign
                                  .map((user) => user.name)
                                  .join(", ")}
                              </TableCell>

                              <TableCell>
                                {
                                  // @ts-ignore
                                  <DeadlineFormat date={brief.deadline} />
                                }
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
                        {briefs.filter((data) => data.status === content)
                          .length !== 0 ? (
                          briefs
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
                                  {brief.assign
                                    .map((user) => user.name)
                                    .join(", ")}
                                </TableCell>

                                <TableCell>
                                  {
                                    // @ts-ignore
                                    <DeadlineFormat date={brief.deadline} />
                                  }
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
    ) : userExist?.role === "Customer Service" ? (
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
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                variant="expandIcon"
                Icon={PlusCircle}
                iconStyle="h-4 w-4"
                iconPlacement="left"
              >
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <SpokeSpinner size="sm" />
                      Loading...
                    </div>
                  ) : (
                    "Add Brief"
                  )}
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
                          <TableHead key={header.trim() + i}>
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    {content === "All" ? (
                      <TableBody>
                        {briefs.filter((data) => data.authorId === userExist.id)
                          .length !== 0 ? (
                          briefs
                            .filter((data) => data.authorId === userExist.id)
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
                                  {brief.assign
                                    .map((user) => user.name)
                                    .join(", ")}
                                </TableCell>

                                <TableCell>
                                  {
                                    // @ts-ignore
                                    <DeadlineFormat date={brief.deadline} />
                                  }
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
                        {briefs.filter(
                          (data) =>
                            data.status === content &&
                            data.authorId === userExist.id
                        ).length !== 0 ? (
                          briefs
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
                                  {brief.assign
                                    .map((user) => user.name)
                                    .join(", ")}
                                </TableCell>

                                <TableCell>
                                  {
                                    // @ts-ignore
                                    <DeadlineFormat date={brief.deadline} />
                                  }
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

            {/* <Link href="/dashboard/briefs/create">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Brief
                </span>
              </Button>
            </Link> */}
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
                          <TableHead key={header.trim() + i}>
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    {content === "All" ? (
                      <TableBody>
                        {briefs ? (
                          briefs
                            .filter((data) =>
                              data.assign.find(({ id }) => id === userExist?.id)
                            )
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

                                <TableCell>{userExist?.name}</TableCell>

                                <TableCell>
                                  {
                                    // @ts-ignore
                                    <DeadlineFormat date={brief.deadline} />
                                  }
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
                        {briefs.filter(
                          (data) =>
                            data.status === content &&
                            data.assign.find(({ id }) => id === userExist?.id)
                        ).length !== 0 ? (
                          briefs
                            .filter(
                              (data) =>
                                data.status === content &&
                                data.assign.find(
                                  ({ id }) => id === userExist?.id
                                )
                            )
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

                                <TableCell>{userExist?.name}</TableCell>

                                <TableCell>
                                  {
                                    // @ts-ignore
                                    <DeadlineFormat date={brief.deadline} />
                                  }
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
