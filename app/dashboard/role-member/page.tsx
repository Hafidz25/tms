"use client";
import React, { useEffect, useState } from "react";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import {
  DataGridTemplate,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { columns } from "./data-grid-columns";

interface RoleMember {
  id: string;
  name: string;
  level: [];
  user: [];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const featureConfig: DataGridShadcnTemplateFeatureConfig<RoleMember> = {
  main: {
    filter: {
      searching: "name",
      // @ts-ignore
      faceting: {},
    },

    rowSelection: {
      onDelete: (selectedData) => {
        const handleMultipleDelete = async () => {
          try {
            const response = selectedData.map((data) => {
              fetch(`/api/role-member/${data.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }).then((response) => {
                if (response.status === 200) {
                  toast.success(`Role ${data.name} deleted successfully.`);
                  mutate("/api/role-member");
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
      text: "Add Role Member",
      link: "/dashboard/role-member/create",
    },

    rowActions: {
      detail: (rowData) => `/dashboard/role-member/${rowData.id}`,
      deleteData: (rowData) => {
        const handleDelete = async () => {
          try {
            const response = await fetch(`/api/role-member/${rowData.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
              toast.success("Role member deleted successfully.");
              mutate("/api/role-member");
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

function RolePage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetcherUserExists = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.user);
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: roleMember, error } = useSWR<RoleMember[], Error>(
    "/api/role-member",
    fetcher,
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists,
  );

  // console.log(levelFee);

  return roleMember && userExist ? (
    <DashboardPanel>
      <DataGridTemplate
        title="Data Role Member"
        data={roleMember}
        // @ts-ignore
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

export default RolePage;
