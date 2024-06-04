"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { userList } from "@/data/user";
import { Calendar, Users } from "lucide-react";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import { ChevronLeft } from "lucide-react";
import { PlateEditor } from "@/components/plate-ui/plate-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chips } from "@/components/ui/chips";
import { Divider } from "@/components/ui/divider";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Feedback from "@/components/custom/Feedback";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
// import { getSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Brief {
  id: string;
  title: string;
  content: string;
  status: string;
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
  feedback: Feedback[];
  createdAt: string;
}

interface Feedback {
  id: string;
  content: string;
  userId: string;
  briefId: string;
  createdAt: string;
}

export default async function DetailBrief({
  params,
}: {
  params: { id: string };
}) {
  const { control, register, handleSubmit } = useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [briefs, setBriefs] = useState<Brief>();
  const [userExist, setUserExist] = useState<User>();
  const [loadUser, setLoadUser] = useState(false);
  const [loadBrief, setLoadBrief] = useState(false);
  const [loadExist, setLoadExist] = useState(false);

  const Router = useRouter();
  const { toast } = useToast();

  // const session = await getSession();
  // console.log(session);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        setLoadUser(true);
      });
    fetch(`/api/briefs/${params.id}`)
      .then((response) => response.json())
      .then((result) => {
        const newContent = JSON.parse(result.data.content);
        const mappedData = { ...result.data, content: newContent };
        setBriefs(mappedData);
        setLoadBrief(true);
      });
    fetch(`/api/auth/session`)
      .then((response) => response.json())
      .then((data) => {
        setUserExist(data.user);
        setLoadExist(true);
      });
  }, []);

  const userChipList = users
    .filter((user) => user.role !== "Admin" && user.role !== "Customer Service")
    .map((user) => {
      const { id, name: text } = user;
      return {
        id,
        text,
      };
    });

  const handleSubmitFeedback = async (data: any) => {
    const newData = {
      ...data,
      userId: userExist?.id,
      briefId: briefs?.id,
    };

    // console.log(newData);
    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Feedback created successfully.",
        });
        // Router.push("/dashboard/briefs");
        location.reload();
      }
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (dataId: string, status: string, assign: any) => {
    try {
      const response = await fetch(`/api/briefs/${dataId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status, assign: assign }),
      });
      // console.log(response);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Brief updated successfully.",
        });
        Router.refresh();
      }
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
    }
  };

  console.log(briefs);

  return loadUser && loadBrief && loadExist ? (
    <Fragment>
      <div className="container py-10 max-w-[1400px]">
        <form className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 mb-12">
            <Link
              href=""
              onClick={() => Router.back()}
              className="w-8 h-8 rounded-lg border border-slate-300 grid place-items-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* <Divider className="my-10" /> */}

          <div className="flex flex-col gap-y-6">
            <div className="w-full border-0 p-0 ring-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:capitalize text-[40px] font-bold">
              {briefs?.title}
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-center sm:max-w-2xl">
              <Select
                defaultValue={briefs?.status}
                onValueChange={(value) => {
                  if (briefs) {
                    updateStatus(briefs.id, value, briefs.assign);
                  }
                }}
              >
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                {userExist?.role === "Admin" ||
                userExist?.role === "Customer Service" ? (
                  <SelectContent>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Waiting for Client">
                      Waiting for Client
                    </SelectItem>
                    <SelectItem value="Correction">Correction</SelectItem>
                    <SelectItem value="In Progress" disabled>
                      In Progress
                    </SelectItem>
                    <SelectItem value="Need Review" disabled>
                      Need Review
                    </SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                ) : (
                  <SelectContent>
                    <SelectItem value="Assigned" disabled>
                      Assigned
                    </SelectItem>
                    <SelectItem value="In Review" disabled>
                      In Review
                    </SelectItem>
                    <SelectItem value="Waiting for Client" disabled>
                      Waiting for Client
                    </SelectItem>
                    <SelectItem value="Correction" disabled>
                      Correction
                    </SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Need Review">Need Review</SelectItem>
                    <SelectItem value="Done" disabled>
                      Done
                    </SelectItem>
                  </SelectContent>
                )}
              </Select>

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              <div className="font-medium text-base flex gap-2 items-center w-full">
                <Calendar className="w-6 h-6" />
                {briefs &&
                  format(new Date(briefs.deadline.to), "EEEE, dd MMM yyyy")}
              </div>

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              <div className="font-medium text-base flex gap-2 items-center w-full">
                <Users className="w-6 h-6" />
                {briefs?.assign.map((user) => user.name).join(", ")}
              </div>
            </div>
          </div>

          <Divider className="my-10" />

          <div className="border rounded-lg">
            <PlateEditor initialValue={briefs.content} readOnly />
          </div>
        </form>
        <Divider className="my-10" />
        <Card>
          <CardHeader>
            <CardTitle>
              Feedback ({briefs?.feedback.map((data) => data).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {briefs?.feedback.map((data) => (
                <Feedback
                  feedbackId={data.id}
                  user={users
                    .filter((user) => user.id === data.userId)
                    .map((user) => user.name)}
                  role={users
                    .filter((user) => user.id === data.userId)
                    .map((user) => user.role)}
                  message={data.content}
                  time={formatDistanceToNow(data.createdAt)}
                  userExist={userExist?.id}
                  userId={users
                    .filter((user) => user.id === data.userId)
                    .map((user) => user.id)}
                  briefId={briefs?.id}
                />
              ))}
            </div>
          </CardContent>
          <CardContent>
            <form
              className="grid w-full gap-2"
              onSubmit={handleSubmit(handleSubmitFeedback)}
            >
              <Textarea
                placeholder="Type your message here."
                {...register("content")}
              />

              <div className="flex justify-start">
                <Button type="submit">Send message</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
