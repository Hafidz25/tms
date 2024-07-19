"use client";
import React, { useEffect, useState } from "react";

import BriefChart from "@/components/custom/BriefChart";
import CardDashboard from "@/components/custom/CardDashboard";
import { User } from "@/types/user";
import { Brief } from "@/types/briefs";
import useSWR, { useSWRConfig } from "swr";
import { SpokeSpinner } from "@/components/ui/spinner";

export default async function Page() {
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const fetcherUserExists = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.user);

  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher
  );
  const { data: briefs, error: briefsError } = useSWR<Brief[], Error>(
    "/api/briefs",
    fetcher
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {userExist ? (
        <>
          <CardDashboard
            users={users ?? []}
            briefs={briefs ?? []}
            userExist={userExist ?? null!}
          />
          <BriefChart
            users={users ?? []}
            briefs={briefs ?? []}
            userExist={userExist ?? null!}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="flex items-center gap-2">
            <SpokeSpinner size="md" />
            <span className="text-md font-medium text-slate-500">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
