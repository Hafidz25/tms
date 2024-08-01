import { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefsStatus } from "@/types/briefs";

import { DataTableColumnHeader } from "./data-table-column-header"; // idk man
import { DataTableRowActions } from "./data-table-row-actions";

interface Payslip {
  id: string;
  userId: string;
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
}

const FORMAT_DATE = "dd LLL, y";

function DeadlineFormat({ date }: { date: DateRange | undefined }) {
  if (!date) return "-";

  return (
    <>
      {date.from ? format(date.from, FORMAT_DATE) : ""}
      {date.to ? ` - ${format(date.to, FORMAT_DATE)}` : ""}
    </>
  );
}

export const columns: ColumnDef<Payslip>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[200px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">{row.getValue("position")}</Badge>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "presence",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Presence" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">{row.getValue("presence")} days</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "period",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[180px] items-center">
        <DeadlineFormat date={row.getValue("period")} />
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },

  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Created At" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex w-[100px] items-center">
  //       <span>{format(row.getValue("createdAt"), FORMAT_DATE)}</span>
  //     </div>
  //   ),
  //   enableSorting: true,
  //   enableHiding: false,
  // },

  {
    id: "actions",
    cell: ({ row, ...props }) => (
      <div className="flex w-[80px] justify-end">
        <DataTableRowActions row={row} {...props} />
      </div>
    ),
  },
];
