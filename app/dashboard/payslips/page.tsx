"use client";
import React, { useEffect, useState } from "react";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import {
  DataGridTemplate,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR, { mutate } from "swr";
import { columns } from "./data-grid-columns";
import { toast } from "sonner";

interface Payslip {
  id: string;
  userId: string;
  name: string;
  position: string;
  period: {
    from: string;
    to: string;
  };
  regularFee: number;
  presence: number;
  transportFee: number;
  thrFee: number;
  otherFee: number;
  totalFee: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const FORMAT_DATE = "dd LLL, y";

const featureConfig: DataGridShadcnTemplateFeatureConfig<Payslip> = {
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
              fetch(`/api/payslips/${data.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }).then((response) => {
                if (response.status === 200) {
                  toast.success(`Payslip deleted successfully.`);
                  mutate("/api/payslips");
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
      text: "Add Payslips",
      link: "/dashboard/payslips/create",
    },

    rowActions: {
      detail: (rowData) => `/dashboard/payslips/${rowData.id}`,
      deleteData: (rowData) => {
        const handleDelete = async () => {
          try {
            const response = await fetch(`/api/payslips/${rowData.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
              toast.success("Payslips deleted successfully.");
              mutate("/api/payslips");
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

function PayslipsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetcherUserExists = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.user);
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const fetcherPayslip = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const { data: payslips, error } = useSWR<Payslip[], Error>(
    "/api/payslips",
    fetcherPayslip,
  );
  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher,
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists,
  );

  if (payslips && users) {
    const mappedPayslip = payslips?.map((data) => {
      return {
        id: data.id,
        userId: data.userId,
        name: users?.filter((user) => user.id === data.userId)[0].name,
        position: data.position,
        period: data.period,
        regularFee: data.regularFee,
        presence: data.presence,
        transportFee: data.transportFee,
        thrFee: data.thrFee,
        otherFee: data.otherFee,
        totalFee: data.totalFee,
        createdAt: data.createdAt,
      };
    });

    // console.log(mappedPayslip);

    const newPayslip =
      userExist?.role === "Admin" || userExist?.role === "Customer Service"
        ? mappedPayslip
        : mappedPayslip?.filter((data) => data.userId === userExist?.id);

    return mappedPayslip && userExist ? (
      <DashboardPanel>
        <DataGridTemplate
          title="Data Payslips"
          data={newPayslip}
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
  } else {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <SpokeSpinner size="md" />
          <span className="text-md font-medium text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }
}

export default PayslipsPage;
