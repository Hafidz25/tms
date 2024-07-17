"use client";
import React, { useEffect, useState } from "react";

import BriefChart from "@/components/custom/BriefChart";
import CardDashboard from "@/components/custom/CardDashboard";
import { Roles } from "@/types/user";
import { User } from "@/types/user";
import { Brief } from "@/types/briefs";

export default async function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [userExist, setUserExist] = useState<User>(null!);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        setLoad(true);
      });
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
        setLoad(true);
      });
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {load ? (
        <>
          <CardDashboard users={users} briefs={briefs} userExist={userExist} />
          <BriefChart briefs={briefs} users={users} userExist={userExist} />
        </>
      ) : null}
    </div>
  );
}
