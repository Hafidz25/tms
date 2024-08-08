import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { createColumns } from "@/lib/data-grid/columns";
import {
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";

interface RoleMember {
  id: string;
  name: string;
  level: [];
  user: [];
  createdAt: string;
}

const FORMAT_DATE = "dd LLL, y";

export const columns = createColumns<RoleMember>((column) => [
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

  column.accessor("level", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Level" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="">{row.original.level.length} Levels</span>
      </div>
    ),

    enableHiding: false,
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
