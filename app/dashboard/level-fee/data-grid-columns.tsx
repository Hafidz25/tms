import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { createColumns } from "@/lib/data-grid/columns";
import {
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";

interface LevelFee {
  id: string;
  level: string;
  regularFee: number;
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

export const columns = createColumns<LevelFee>((column) => [
  column.display({
    id: "select",
    enableHiding: false,

    header: ({ table }) => <DataGridRowSelection scope="all" table={table} />,

    cell: ({ row }) => <DataGridRowSelection scope="single" row={row} />,
  }),

  column.accessor("level", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Level" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[100px] truncate font-medium">
          {row.getValue("level")}
        </span>
      </div>
    ),

    enableHiding: false,
  }),

  column.accessor("regularFee", {
    header: ({ column }) => <DataGridCellHeader column={column} title="Fee" />,

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="">{formatCurrency(row.getValue("regularFee"))}</span>
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
      const featureConfig = table.options.meta
        ?.featureConfig as DataGridShadcnTemplateFeatureConfig<LevelFee>;

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
