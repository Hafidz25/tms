"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X, PlusCircle, FileDown } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import * as XLSX from "xlsx";
import { getMonth, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { BriefsStatus } from "@/types/briefs";
import { User } from "@/types/user";
import { SpokeSpinner } from "@/components/ui/spinner";
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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const statusOption = [
  "Assigned",
  "In Review",
  "Waiting for Client",
  "Correction",
  "In Progress",
  "Need Review",
  "Done",
].map((s) => ({
  value: s,
  label: s,
}));

const FORMAT_DATE = "dd LLL, y";

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

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isLoading, setIsLoading] = useState(false);
  const { control, register, handleSubmit } = useForm();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const user = table.options.meta?.user;
  // console.log(user?.role);

  useEffect(() => {
    fetch("/api/briefs")
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
      });
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Briefs title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event: any) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusOption}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {user?.role === "Admin" || user?.role === "Customer Service" ? (
        <div className="flex items-center gap-2">
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
                      <Select onValueChange={(value) => field.onChange(value)}>
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
                      <Select onValueChange={(value) => field.onChange(value)}>
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
      ) : null}
    </div>
  );
}
