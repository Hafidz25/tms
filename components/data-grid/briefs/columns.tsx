import { ColumnDef } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefsStatus } from "@/types/briefs";

import { DataTableColumnHeader } from "./data-table-column-header"; // idk man
import { DataTableRowActions } from "./data-table-row-actions";

import {
  Timer,
  SearchX,
  Clock,
  CircleCheck,
  FileSearch,
  MessageSquareDiff,
  Search,
} from "lucide-react";

interface Brief {
  id: string;
  title: string;
  status: BriefsStatus;
  createdAt: Date;
  deadline?: DateRange | undefined;
}

const FORMAT_DATE = "LLL dd, y";

const iconStatus = (status: BriefsStatus) => {
  switch (status) {
    case "Assigned":
      return <MessageSquareDiff className="w-3.5 h-3.5" />;
    case "In Review":
      return <FileSearch className="w-3.5 h-3.5" />;
    case "Waiting for Client":
      return <Clock className="w-3.5 h-3.5" />;
    case "Correction":
      return <SearchX className="w-3.5 h-3.5" />;
    case "In Progress":
      return <Timer className="w-3.5 h-3.5" />;
    case "Need Review":
      return <Search className="w-3.5 h-3.5" />;
    case "Done":
      return <CircleCheck className="w-3.5 h-3.5" />;
  }
};

function DeadlineFormat({ date }: { date: DateRange | undefined }) {
  if (!date) return "-";

  return (
    <>
      {date.from ? format(date.from, FORMAT_DATE) : ""}
      {date.to ? ` - ${format(date.to, FORMAT_DATE)}` : ""}
    </>
  );
}

export const columns: ColumnDef<Brief>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[300px] truncate font-medium">
          {row.getValue("title")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "assign",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assign" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[200px] truncate font-medium">
          {(row.getValue("assign") as any[])
            .map((user) => user.name)
            .join(", ")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[180px] items-center">
        <Badge variant="outline" className="flex items-center gap-2">
          {iconStatus(row.getValue("status"))}
          {row.getValue("status")}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deadline" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[180px] items-center">
        <DeadlineFormat date={row.getValue("deadline")} />
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
