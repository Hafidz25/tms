"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { userList } from "@/data/user";
import { Calendar, Users, CircleFadingPlus, PenTool } from "lucide-react";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ChevronLeft } from "lucide-react";
import { PlateEditor } from "@/components/plate-ui/plate-editor";
import { PlateEditorPreview } from "@/components/plate-ui/plate-editor-preview";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Feedback from "@/components/custom/Feedback";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { SpokeSpinner } from "@/components/ui/spinner";
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
  feedback: Feedback[];
  createdAt: string;
}

interface Feedback {
  id: string;
  content: string;
  userId: string;
  briefId: string;
  userSentId: string;
  isPrivate: boolean;
  isEdited: boolean;
  createdAt: string;
}

export default async function DetailBrief({
  params,
}: {
  params: { id: string };
}) {
  const { control, register, handleSubmit, watch } = useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [briefs, setBriefs] = useState<Brief>();
  const [userExist, setUserExist] = useState<User>();
  const [loadUser, setLoadUser] = useState(false);
  const [loadBrief, setLoadBrief] = useState(false);
  const [loadExist, setLoadExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const [title, setTitle] = useState(null);

  const Router = useRouter();

  // const session = await getSession();
  console.log(briefs);

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
        setTitle(mappedData.title);
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
    setIsLoading(true);
    const newData = {
      content: JSON.stringify(data.content),
      userId: userExist?.id,
      briefId: briefs?.id,
      userSentId: data.userSentId,
      isPrivate: data.isPrivate,
    };

    // console.log(newData);
    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (data.isPrivate === true) {
        const responseNotif = await fetch(`/api/brief-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${userExist?.name.italics()} has sent private feedback on ${briefs?.title.italics()}`,
            briefId: briefs?.id,
            assign: [{ id: data.userSentId }],
          }),
        });
      } else {
        const responseNotif = await fetch(`/api/brief-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${userExist?.name.italics()} has sent feedback on ${briefs?.title.italics()}`,
            briefId: briefs?.id,
            assign: briefs?.assign,
          }),
        });
      }
      // console.log(response);
      if (response.status === 201) {
        setIsLoading(false);
        toast.success("Feedback created successfully.");
        // Router.push("/dashboard/briefs");
        location.reload();
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.");
      }
      return response;
    } catch (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  const updateStatus = async (
    dataId: string,
    status: string,
    assign: any,
    briefTitle: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/briefs/${dataId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status, assign: assign }),
      });
      const responseNotif = await fetch(`/api/brief-notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Status brief ${briefTitle.italics()} just updated to ${status.italics()}`,
          briefId: dataId,
          assign: assign,
        }),
      });
      // console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Brief updated successfully.");
        Router.refresh();
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.");
      }
      return response;
    } catch (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.");
    }
  };

  // console.log(briefs);

  return loadUser && loadBrief && loadExist ? (
    <Fragment>
      <title>
        {title
          ? `${title} - Task Management System`
          : "Detail Brief - Task Management System"}
      </title>
      <div className="min-h-screen w-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <form className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4">
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

            <div className="flex gap-1 font-medium text-base items-center">
              <div className="flex gap-2 items-center">
                <PenTool className="w-5 h-5" />
                by
              </div>
              {users
                .filter((user) => user.id === briefs?.authorId)
                .map((user) => user.name)}
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-center">
              <div className="font-medium text-base flex gap-2 items-center w-full">
                <CircleFadingPlus className="w-6 h-6" />
                <Select
                  defaultValue={briefs?.status}
                  onValueChange={(value) => {
                    if (briefs) {
                      updateStatus(
                        briefs.id,
                        value,
                        briefs.assign,
                        briefs.title
                      );
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
              </div>

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              <div className="font-medium text-base flex gap-2 items-center w-full">
                <Calendar className="w-6 h-6" />
                {briefs &&
                  format(new Date(briefs.deadline.to), "EEEE, dd MMM yyyy")}
              </div>

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              <div className="font-medium text-base flex gap-2 items-center w-full">
                <Users className="w-6 h-6" />
                {userExist?.role === "Admin" ||
                userExist?.role === "Customer Service"
                  ? briefs?.assign.map((user) => user.name).join(", ")
                  : userExist?.name}
              </div>
            </div>
          </div>

          <Divider className="my-10" />

          <div className="border rounded-lg">
            {
              // @ts-ignore
              <PlateEditorPreview initialValue={briefs.content} readOnly />
            }
          </div>
        </form>
        <Divider className="mx-auto max-w-[59rem] lg:min-w-[59rem]" />
        <Card className="mx-auto max-w-[59rem] lg:min-w-[59rem]">
          <CardHeader>
            <CardTitle>
              Feedback ({briefs?.feedback.map((data) => data).length})
            </CardTitle>
          </CardHeader>
          <DndProvider backend={HTML5Backend}>
            <CardContent>
              <div className="flex flex-col gap-3">
                {briefs?.feedback
                  .sort(function compare(a, b) {
                    var dateA = new Date(a.createdAt);
                    var dateB = new Date(b.createdAt);
                    // @ts-ignore
                    return dateA - dateB;
                  })
                  .map((data) => (
                    <Feedback
                      key={data.id}
                      feedbackId={data.id}
                      user={users
                        .filter((user) => user.id === data.userId)
                        .map((user) => user.name)}
                      userSent={users
                        .filter((user) => user.id === data.userSentId)
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
                      userSentId={data.userSentId}
                      briefId={briefs?.id}
                      isPrivate={data.isPrivate}
                      isEdited={data.isEdited}
                    />
                  ))}
              </div>
            </CardContent>
            <CardContent>
              <form
                className="grid w-full gap-2"
                onSubmit={handleSubmit(handleSubmitFeedback)}
              >
                {/* <Textarea
                placeholder="Type your message here."
                {...register("content")}
              /> */}

                <div className="border rounded-lg">
                  <Controller
                    control={control}
                    name="content"
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

                <div className="flex flex-col gap-4 my-2 w-full">
                  <div className="flex gap-3 items-center">
                    <Controller
                      control={control}
                      name="isPrivate"
                      render={({ field }) => (
                        <Switch
                          id="isPrivate"
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            setShowUsers(value);
                          }}
                        />
                      )}
                    />
                    <Label htmlFor="isPrivate">Private message</Label>
                  </div>

                  {showUsers ? (
                    <div className="flex flex-col gap-3 w-1/2">
                      <Label htmlFor="userSentId" className="line-clamp-1">
                        Send to
                      </Label>
                      <Controller
                        control={control}
                        name="userSentId"
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger
                              id="userSentId"
                              aria-label="Select user"
                            >
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                              {userExist?.id === briefs?.authorId
                                ? users
                                  ? users
                                      .filter(
                                        (user) =>
                                          user.id !== userExist?.id &&
                                          briefs?.assign.find(
                                            ({ id }) => id === user.id
                                          )
                                      )
                                      .map((user) => (
                                        <SelectItem value={user.id}>
                                          {user.name}
                                        </SelectItem>
                                      ))
                                  : null
                                : users
                                ? users
                                    .filter(
                                      (user) =>
                                        user.id === briefs?.authorId ||
                                        (briefs?.assign.find(
                                          ({ id }) => id === user.id
                                        ) &&
                                          user.id !== userExist?.id)
                                    )
                                    .map((user) => (
                                      <SelectItem value={user.id}>
                                        {user.name}
                                      </SelectItem>
                                    ))
                                : null}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-start">
                  <Button type="submit" size="sm" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <SpokeSpinner size="sm" />
                        Loading...
                      </div>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </DndProvider>
        </Card>
      </div>

      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
