"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { User } from "@/types/user";
import { SpokeSpinner } from "@/components/ui/spinner";
import { BriefsTable } from "@/components/data-grid/briefs";
import useSWR, { useSWRConfig } from "swr";

interface Brief {
  id: string;
  title: string;
  description: string;
  status: string;
  authorId: string;
  deadline: {
    from: string;
    to: string;
  };
  assign: [
    {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  ];
  feedback: [];
  createdAt: string;
}

const Page = () => {
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
      <BriefsTable
        data={newBriefs}
        meta={{
          user: userExist,
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
};

export default Page;
