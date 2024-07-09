"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { User } from "@/types/user";
import { SpokeSpinner } from "@/components/ui/spinner";
import { BriefsTable } from "@/components/data-grid/briefs";

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
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [load, setLoad] = useState(false);
  const [userExist, setUserExist] = useState<User>();
  const [loadSession, setLoadSession] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    fetch("/api/briefs")
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
        setLoad(true);
      });
    fetch(`/api/auth/session`)
      .then((response) => response.json())
      .then((data) => {
        setUserExist(data.user);
        setLoadSession(true);
      });
  }, []);

  const newBriefs =
    userExist?.role === "Admin"
      ? briefs
      : userExist?.role === "Customer Service"
      ? briefs.filter((data) => data.authorId === userExist.id)
      : briefs.filter((data) =>
          data.assign.find(({ id }) => id === userExist?.id)
        );

  return load && loadSession ? (
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
