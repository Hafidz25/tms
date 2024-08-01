import { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "./data-table-column-header"; // idk man
import { DataTableRowActions } from "./data-table-row-actions";

interface LevelFee {
  id: string;
  userId: string;
  level: string;
  regularFee: number;
}

const FORMAT_DATE = "dd LLL, y";

const formatCurrency = (number: any) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

export const columns: ColumnDef<LevelFee>[] = [
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[300px] truncate font-medium">
          {row.getValue("level")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "regularFee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[300px] ">
          {formatCurrency(row.getValue("regularFee"))}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>{format(row.getValue("createdAt"), FORMAT_DATE)}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row, ...props }) => (
      <div className="flex w-[80px] justify-end">
        <DataTableRowActions row={row} {...props} />
      </div>
    ),
  },
];
