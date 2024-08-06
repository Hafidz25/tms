import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Brief, BriefsStatus } from "@/types/briefs";
import { createColumns } from "@/lib/data-grid/columns";
import { Badge } from "@/components/ui/badge";
import {
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";

import {
  Timer,
  SearchX,
  Clock,
  CircleCheck,
  FileSearch,
  MessageSquareDiff,
  Search,
} from "lucide-react";

const iconStatus = (status: BriefsStatus) => {
  switch (status) {
    case "Assigned":
      return <MessageSquareDiff className="h-3.5 w-3.5" />;
    case "In Review":
      return <FileSearch className="h-3.5 w-3.5" />;
    case "Waiting for Client":
      return <Clock className="h-3.5 w-3.5" />;
    case "Correction":
      return <SearchX className="h-3.5 w-3.5" />;
    case "In Progress":
      return <Timer className="h-3.5 w-3.5" />;
    case "Need Review":
      return <Search className="h-3.5 w-3.5" />;
    case "Done":
      return <CircleCheck className="h-3.5 w-3.5" />;
  }
};

const FORMAT_DATE = "dd LLL, y";

export const columns = createColumns<Brief>((column) => [
  column.display({
    id: "select",
    enableHiding: false,

    header: ({ table }) => <DataGridRowSelection scope="all" table={table} />,

    cell: ({ row }) => <DataGridRowSelection scope="single" row={row} />,
  }),

  column.accessor("title", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Title" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[100px] truncate font-medium">
          {row.getValue("title")}
        </span>
      </div>
    ),

    enableHiding: false,
  }),

  column.accessor("assign", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Assign" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="">
          {(row.getValue("assign") as any[])
            .map((user) => user.name)
            .join(", ")}
        </span>
      </div>
    ),

    enableHiding: false,
  }),

  column.accessor("status", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Status" />
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
  }),

  column.accessor("deadline", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Deadline" />
    ),

    cell: ({ row }) => {
      const date = row.getValue("deadline") satisfies DateRange | undefined;

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
      const featureConfig = table.options.meta
        ?.featureConfig as DataGridShadcnTemplateFeatureConfig<Brief>;

      return (
        <div className="w-max">
          <DataGridRowActions
            row={row}
            detail={featureConfig?.incremental.rowActions.detail}
            deleteData={featureConfig.incremental.rowActions.deleteData}
          />
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
