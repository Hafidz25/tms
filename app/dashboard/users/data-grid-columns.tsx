import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { createColumns } from "@/lib/data-grid/columns";
import {
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { mutate } from "swr";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const FORMAT_DATE = "dd LLL, y";
const TABLE_CONTENT_ROLE = ["Admin", "Customer Service", "Team Member"];

export const columns = createColumns<User>((column) => [
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

  column.accessor("email", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Email" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="">{row.getValue("email")}</span>
      </div>
    ),

    enableHiding: false,
  }),

  column.accessor("role", {
    header: ({ column }) => <DataGridCellHeader column={column} title="Role" />,

    cell: ({ row }) => {
      const updateRole = async (
        dataId: string,
        role: string,
        name: string,
        email: string,
      ) => {
        try {
          const response = await fetch(`/api/users/${dataId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email, role: role }),
          });
          // console.log(response);
          if (response.status === 200) {
            toast.success("User updated successfully.");
            mutate("/api/users");
          }
          return response;
        } catch (error) {
          toast.error("Uh oh! Something went wrong.");
        }
      };

      return (
        <div className="flex space-x-2">
          <Select
            defaultValue={row.getValue("role")}
            onValueChange={(value) =>
              updateRole(
                row.original.id,
                value,
                row.getValue("name"),
                row.getValue("name"),
              )
            }
          >
            <SelectTrigger id="status" aria-label="Select status">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              {TABLE_CONTENT_ROLE.map((role, i) => (
                <SelectItem key={role.trim() + i} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },

    enableHiding: false,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
