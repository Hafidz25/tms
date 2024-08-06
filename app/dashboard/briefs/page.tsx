"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { User } from "@/types/user";
import { SpokeSpinner } from "@/components/ui/spinner";
import { DataGridTemplate, DataGridShadcnTemplateFeatureConfig } from "@/components/data-grid/shadcn";
import {columns} from "./data-grid-columns"
import { statusOption } from "./data-grid-config";
import useSWR, { mutate, useSWRConfig } from "swr";
import { Brief } from "@/types/briefs";
import { toast } from "sonner";


const featureConfig: DataGridShadcnTemplateFeatureConfig<Brief> = {
  main: {
    filter: {
      searching: "title",
      faceting: {
        status: statusOption,
      },
    },

    rowSelection: {
      onDelete: (selectedData) => {
        const handleMultipleDelete = async () => {
          try {
            const response = selectedData.map((data) => {
              fetch(`/api/briefs/${data.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }).then((response) => {
                if (response.status === 200) {
                  toast.success(`Brief ${data.title} deleted successfully.`);
                  mutate("/api/briefs");
                } else if (response.status === 403) {
                  toast.warning("You dont have access.");
                }
              })
            })
      
            
            return response;
          } catch (error) {
            toast.error("Uh oh! Something went wrong.");
          }
        }
        return handleMultipleDelete()
      }
    },
  },

  incremental: {
    addData: {
      text: "Add Brief",
      link: "/dashboard/briefs/create",
    },

    rowActions: {
      detail: (rowData) => `/dashboard/briefs/${rowData.id}`,
      deleteData: (rowData) => {
        const handleDelete = async () => {
          try {
            const response = await fetch(`/api/briefs/${rowData.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });
      
            if (response.status === 200) {
              toast.success("Brief deleted successfully.");
              mutate("/api/briefs");
            } else if (response.status === 403) {
              toast.warning("You dont have access.");
            }
            return response;
          } catch (error) {
            toast.error("Uh oh! Something went wrong.");
          }
        }
        return handleDelete()
      }
    },
  },
};

const BriefPage = () => {
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const fetcherUserExists = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.user);

  const { data: briefs, error: briefsError } = useSWR<Brief[], Error>(
    "/api/briefs",
    fetcher
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists
  );

  const newBriefs =
    userExist?.role === "Admin"
      ? briefs
      : userExist?.role === "Customer Service"
      ? briefs?.filter((data) => data.authorId === userExist.id)
      : briefs?.filter((data) =>
          data.assign.find(({ id }) => id === userExist?.id)
        );

  return newBriefs && userExist ? (
    <DashboardPanel>
      <DataGridTemplate
        title="Data Briefs"
        data={newBriefs}
        columns={columns}
        featureConfig={featureConfig}
      />
    </DashboardPanel>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
};

export default BriefPage;
