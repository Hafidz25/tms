import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { createColumns } from "@/lib/data-grid/columns";
import {
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import { Badge } from "@/components/ui/badge";

interface Payslip {
  id: string;
  userId: string;
  name: string;
  position: string;
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
  createdAt: string;
}

const formatCurrency = (number: any) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

const FORMAT_DATE = "dd LLL, y";

export const columns = createColumns<Payslip>((column) => [
  column.display({
    id: "select",
    enableHiding: false,

    header: ({ table }) => <DataGridRowSelection scope="all" table={table} />,

    cell: ({ row }) => <DataGridRowSelection scope="single" row={row} />,
  }),

  column.accessor("name", {
    header: ({ column }) => <DataGridCellHeader column={column} title="Name" />,

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[100px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),

    enableHiding: false,
  }),

  column.accessor("position", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Position" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{row.getValue("position")}</Badge>
      </div>
    ),
  }),

  column.accessor("period", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Period" />
    ),

    cell: ({ row }) => {
      const date = row.getValue("period") satisfies DateRange | undefined;

      if (!date) return "-";
      return (
        <div className="flex w-[180px] items-center">
          <>
            {date.from ? format(date.from, FORMAT_DATE) : ""}
            {date.to ? ` - ${format(date.to, FORMAT_DATE)}` : ""}
          </>
        </div>
      );
    },

    filterFn: (row, id, value) => {
      const date = row.getValue("period") satisfies DateRange | undefined;
      return value.includes(date?.from ? format(date.from, "LLLL") : "");
    },
  }),

  column.accessor("createdAt", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Created At" />
    ),

    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>{format(row.getValue("createdAt"), FORMAT_DATE)}</span>
      </div>
    ),
  }),

  column.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      return (
        <div className="w-max">
          <DataGridRowActions row={row} table={table} />
        </div>
      );
    },

    meta: {
      cell: {
        className: "flex justify-end max-w-full min-w-[70px] pr-6",
      },
    },
  }),
]);
