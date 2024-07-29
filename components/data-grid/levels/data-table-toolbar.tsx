"use client";
import React, { useState } from "react";
import Link from "next/link";
import { X, PlusCircle, FileDown } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpokeSpinner } from "@/components/ui/spinner";

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

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isLoading, setIsLoading] = useState(false);

  const user = table.options.meta?.user;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Levels name..."
          value={(table.getColumn("level")?.getFilterValue() as string) ?? ""}
          onChange={(event: any) =>
            table.getColumn("level")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* {table.getColumn("position") && (
          <DataTableFacetedFilter
            column={table.getColumn("position")}
            title="Status"
            options={statusOption}
          />
        )} */}

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

      {user?.role === "Admin" ? (
        <div className="flex items-center gap-2">
          <Link href="/dashboard/level-fee/create">
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
                    Add Level
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
