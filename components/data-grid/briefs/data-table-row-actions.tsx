"use client";
import { Ellipsis, Eye, Pencil, Trash2 } from "lucide-react";
import { CellContext, Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Roles, User } from "@/types/user";
import { Brief } from "@/types/briefs";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { SpokeSpinner } from "@/components/ui/spinner";

const CURRENT_SEGMENT_ROUTE = "/dashboard/briefs";

interface DropdownMenuActionsProps
  extends React.ComponentProps<typeof DropdownMenu> {
  dataId: string;
}

export function DataTableRowActions<TData>({
  table,
  row,
}: CellContext<TData, unknown>) {
  const [isLoading, setIsLoading] = useState(false);

  const user = table.options.meta?.user;
  const rawData = row.original as Brief;

  const dataId = rawData.id;

  const handleDelete = async (dataId: string) => {
    try {
      const response = await fetch(`/api/briefs/${dataId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Brief deleted successfully.");
        // Router.refresh();
        location.reload();
      } else if (response.status === 403) {
        toast.warning("You dont have access.");
      }
      return response;
    } catch (error) {
      toast.error("Uh oh! Something went wrong.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link
            onClick={() => setIsLoading(true)}
            href={CURRENT_SEGMENT_ROUTE + `/${dataId}`}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <SpokeSpinner size="xs" />
                Loading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Detail
              </div>
            )}
          </Link>
        </DropdownMenuItem>

        {user?.role === "Admin" || user?.role === "Customer Service" ? (
          <DropdownMenuItem>
            <Link
              href={CURRENT_SEGMENT_ROUTE + `/edit/${dataId}`}
              className="w-full flex items-center gap-2"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Link>
          </DropdownMenuItem>
        ) : null}

        {user?.role === "Admin" || user?.role === "Customer Service" ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <Link href="" className="w-full flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Link>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete data</DialogTitle>
                    <DialogDescription>
                      Are you sure to delete this data?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button type="reset" variant="outline">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => handleDelete(dataId)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
