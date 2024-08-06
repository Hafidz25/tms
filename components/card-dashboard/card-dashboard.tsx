"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { PackageCheck, BriefcaseBusiness, Headset, Users } from "lucide-react";
import { User } from "@/types/user";
import { Brief } from "@/types/briefs";

interface CardProps {
  users: User[];
  briefs: Brief[];
  userExist: User;
}

const CardDashboard = ({ users, briefs, userExist }: CardProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Customer Services
          </CardTitle>
          <Headset className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {users.filter((data) => data.role === "Customer Service").length}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Member</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {users.filter((data) => data.role === "Team Member").length}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Brief Ongoing</CardTitle>
          <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userExist?.role === "Admin" ||
            userExist?.role === "Customer Service"
              ? briefs.filter((data) => data.status !== "Done").length
              : briefs.filter(
                  (data) =>
                    data.status !== "Done" &&
                    data.assign.find(({ id }) => id === userExist?.id)
                ).length}
          </div>
          {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-01-chunk-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Brieft Done</CardTitle>
          <PackageCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {userExist?.role === "Admin" ||
            userExist?.role === "Customer Service"
              ? briefs.filter((data) => data.status === "Done").length
              : briefs.filter(
                  (data) =>
                    data.status === "Done" &&
                    data.assign.find(({ id }) => id === userExist?.id)
                ).length}
          </div>
          {/* <p className="text-xs text-muted-foreground">+201 since last hour</p> */}
        </CardContent>
      </Card>
    </div>
  );
};
export default CardDashboard;
