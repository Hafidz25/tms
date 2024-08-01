"use client";
import React, { useEffect, useState } from "react";

import { DashboardPanel } from "@/components/layouts/dashboard-panel";

import { SpokeSpinner } from "@/components/ui/spinner";
import useSWR from "swr";
import { LevelsTable } from "@/components/data-grid/levels";

interface LevelFee {
  id: string;
  level: number;
  regularFee: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

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
    fetcher
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists
  );

  // console.log(levelFee);

  return levelFee && userExist ? (
    <DashboardPanel>
      <LevelsTable
        data={levelFee}
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
}

export default LevelPage;
