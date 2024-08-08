"use client";
import React, { useEffect, useState } from "react";

import {
  DataGridTemplate,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { toast } from "sonner";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR, { mutate, useSWRConfig } from "swr";
import { columns } from "./data-grid-columns";
import { roleOption } from "./data-grid-config";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const featureConfig: DataGridShadcnTemplateFeatureConfig<User> = {
  main: {
    filter: {
      searching: "name",
      faceting: {
        role: roleOption,
      },
    },

    rowSelection: {
      onDelete: (selectedData) => {
        const handleMultipleDelete = async () => {
          try {
            const response = selectedData.map((data) => {
              fetch(`/api/users/${data.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }).then((response) => {
                if (response.status === 200) {
                  toast.success(`User ${data.name} deleted successfully.`);
                  mutate("/api/users");
                } else if (response.status === 403) {
                  toast.warning("You dont have access.");
                }
              });
            });

            return response;
          } catch (error) {
            toast.error("Uh oh! Something went wrong.");
          }
        };
        return handleMultipleDelete();
      },
    },
  },

  incremental: {
    addData: {
      text: "Add User",
      link: "/dashboard/users/create",
    },

    rowActions: {
      detail: (rowData) => `/dashboard/users/${rowData.id}`,
      deleteData: (rowData) => {
        const handleDelete = async () => {
          try {
            const response = await fetch(`/api/users/${rowData.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
              toast.success("User deleted successfully.");
              mutate("/api/users");
            } else if (response.status === 403) {
              toast.warning("You dont have access.");
            }
            return response;
          } catch (error) {
            toast.error("Uh oh! Something went wrong.");
          }
        };
        return handleDelete();
      },
    },
  },
};

function UsersPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: users, error } = useSWR<User[], Error>("/api/users", fetcher);

  return users ? (
    <DashboardPanel>
      <DataGridTemplate
        title="Data Users"
        data={users}
        //@ts-ignore
        columns={columns}
        featureConfig={featureConfig}
      />
    </DashboardPanel>
  ) : (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}

export default UsersPage;
