"use client";
import React, { useEffect, useState } from "react";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import {
  DataGridTemplate,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR, { mutate } from "swr";
import { LevelsTable } from "@/components/data-grid/levels";
import { toast } from "sonner";
import { columns } from "./data-grid-columns";

interface LevelFee {
  id: string;
  level: string;
  regularFee: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const featureConfig: DataGridShadcnTemplateFeatureConfig<LevelFee> = {
  main: {
    filter: {
      searching: "level",
      // @ts-ignore
      faceting: {},
    },

    rowSelection: {
      onDelete: (selectedData) => {
        const handleMultipleDelete = async () => {
          try {
            const response = selectedData.map((data) => {
              fetch(`/api/level-fee/${data.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }).then((response) => {
                if (response.status === 200) {
                  toast.success(`Level ${data.level} deleted successfully.`);
                  mutate("/api/level-fee");
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
      text: "Add Level",
      link: "/dashboard/level-fee/create",
    },

    rowActions: {
      detail: (rowData) => `/dashboard/level-fee/${rowData.id}`,
      deleteData: (rowData) => {
        const handleDelete = async () => {
          try {
            const response = await fetch(`/api/level-fee/${rowData.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
              toast.success("Level deleted successfully.");
              mutate("/api/level-fee");
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

function LevelPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetcherUserExists = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.user);
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: levelFee, error } = useSWR<LevelFee[], Error>(
    "/api/level-fee",
    fetcher,
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists,
  );

  // console.log(levelFee);

  return levelFee && userExist ? (
    <DashboardPanel>
      <DataGridTemplate
        title="Data Levels"
        data={levelFee}
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

export default LevelPage;
