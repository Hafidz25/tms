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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Brief {
  id: string;
  title: string;
  description: string;
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
  feedback: [];
  createdAt: string;
}

export default function DetailBrief({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit } = useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [load, setLoad] = useState(false);

  const Router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
      });
    fetch(`/api/briefs/${params.id}`)
      .then((response) => response.json())
      .then((data) => {
        setBriefs(data.data);
        setLoad(true);
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

  const handleSubmitBrief = async (data: any) => {
    try {
      // console.log(body);
      const response = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.Judul,
          deadline: data.Deadline,
          content: JSON.stringify(data.Editor),
          assign: data.Assign,
        }),
      });
      // console.log(response);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "User created successfully.",
        });
        Router.push("/dashboard/briefs");
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

  return load ? (
    <Fragment>
      <div className="container py-10 max-w-[1400px]">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSubmitBrief)}
        >
          <div className="flex items-center justify-between gap-4 mb-12">
            <Link
              href=""
              onClick={() => Router.back()}
              className="w-8 h-8 rounded-lg border border-slate-300 grid place-items-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            <Button size="sm" type="submit">
              Add Brief
            </Button>
          </div>

          {/* <Divider className="my-10" /> */}

          <div className="flex flex-col gap-y-6">
            <div className="w-full border-0 p-0 ring-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:capitalize text-[40px] font-bold">
              {briefs.title}
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-center sm:max-w-2xl">
              <Select defaultValue={briefs.status}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              {/* <Controller
                control={control}
                name="Deadline"
                render={({ field }) => (
                  <DateRangePicker
                    mode="range"
                    onChange={(range) => {
                      field.onChange(range);
                    }}
                  />
                )}
              /> */}
              <div className="font-medium text-base flex gap-2 items-center w-full">
                <Calendar className="w-6 h-6" />
                {format(new Date(briefs.deadline.to), "EEEE, dd MMM yyyy")}
              </div>

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              {/* {load ? (
                <Controller
                  control={control}
                  name="Assign"
                  render={({ field }) => (
                    <Chips
                      chipItems={userChipList}
                      onChange={(value) => {
                        field.onChange(value.map((data) => ({ id: data.id })));
                      }}
                    />
                  )}
                />
              ) : null} */}
              <div className="font-medium text-base flex gap-2 items-center w-full">
                <Users className="w-6 h-6" />
                {briefs.assign.map((user) => user.name).join(", ")}
              </div>
            </div>
          </div>

          <Divider className="my-10" />

          <div className="border rounded-lg">
            <Controller
              control={control}
              name="Editor"
              render={({ field }) => (
                <PlateEditor
                  // @ts-ignore
                  onChange={(editorValue: any) => {
                    field.onChange(editorValue);
                  }}
                />
              )}
            />
          </div>
        </form>
        <Divider className="my-10" />
        <Card>
          <CardHeader>
            <CardTitle>
              Feedback ({briefs.feedback.map((data) => data).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {briefs.feedback.map((data) => (
                <Feedback
                  user={users
                    .filter((user) => user.id === data.userId)
                    .map((user) => user.name)}
                  role={users
                    .filter((user) => user.id === data.userId)
                    .map((user) => user.role)}
                  message={data.content}
                  time={formatDistanceToNow(data.createdAt)}
                />
              ))}
            </div>
          </CardContent>
          <CardContent>
            <form className="grid w-full gap-2">
              <Textarea placeholder="Type your message here." />
              <div className="flex justify-start">
                <Button>Send message</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
