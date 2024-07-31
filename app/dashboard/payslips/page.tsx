"use client";
import React, { useEffect, useState } from "react";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";

import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR from "swr";
import { PayslipsTable } from "@/components/data-grid/payslips";

interface Payslip {
  id: string;
  userId: string;
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
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const FORMAT_DATE = "dd LLL, y";

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
    fetcherPayslip
  );
  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists
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
      };
    });

    // console.log(mappedPayslip);

    const newPayslip =
      userExist?.role === "Admin" || userExist?.role === "Customer Service"
        ? mappedPayslip
        : mappedPayslip?.filter((data) => data.userId === userExist?.id);

    return mappedPayslip && userExist ? (
      <DashboardPanel>
        <PayslipsTable
          data={newPayslip}
          meta={{
            user: userExist,
            users: users,
          }}
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
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center gap-2">
          <SpokeSpinner size="md" />
          <span className="text-md font-medium text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }
}

export default PayslipsPage;
