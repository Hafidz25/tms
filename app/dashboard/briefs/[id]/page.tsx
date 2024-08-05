"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Calendar,
  Users,
  CircleFadingPlus,
  PenTool,
  SendHorizonal,
  Timer,
  SearchX,
  Clock,
  CircleCheck,
  FileSearch,
  MessageSquareDiff,
  ChevronLeft,
  CornerRightDown,
  Search,
  Pencil,
  Eye,
} from "lucide-react";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { PlateEditor } from "@/components/plate-ui/plate-editor";
import { PlateEditorPreview } from "@/components/plate-ui/plate-editor-preview";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Feedback from "@/components/custom/Feedback";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { SpokeSpinner } from "@/components/ui/spinner";
import generator from "generate-password";
import useSWR, { useSWRConfig } from "swr";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Chips, ChipItemProps } from "@/components/ui/chips";

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
  status: string;
  isReply: boolean;
  replyId: string;
  isEdited: boolean;
  createdAt: string;
}

export default function DetailBrief({ params }: { params: { id: string } }) {
  const { control, register, handleSubmit, watch, resetField, setValue } =
    useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const { mutate } = useSWRConfig();
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState(null);
  const FORMAT_DATE = "dd LLL, y";
  const Router = useRouter();

  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data);
  const fetcherBrief = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        const newContent = JSON.parse(result.data.content);
        const mappedData = { ...result.data, content: newContent };
        setTitle(mappedData.title);
        return mappedData;
      });
  const fetcherUserExists = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.user);

  const { data: users, error: usersError } = useSWR<User[], Error>(
    "/api/users",
    fetcher
  );
  const { data: usersChip, error: usersChipError } = useSWR<
    ChipItemProps[],
    Error
  >("/api/users", fetcher);
  const { data: briefs, error: briefsError } = useSWR<Brief, Error>(
    `/api/briefs/${params.id}`,
    fetcherBrief
  );
  const { data: userExist, error: userExistError } = useSWR<User, Error>(
    "/api/auth/session",
    fetcherUserExists
  );

  const handleSubmitFeedback = async (data: any) => {
    setIsLoading(true);
    const newData = {
      content: JSON.stringify(data.content),
      userId: userExist?.id,
      briefId: briefs?.id,
      userSentId: data.userSentId,
      isReply: false,
      replyId: generator.generate({
        length: 24,
        numbers: true,
      }),
      status: "Not Approved",
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
        setIsLoading(false);
        toast.success("Feedback created successfully.");
        mutate(`/api/briefs/${params.id}`);
        mutate("/api/brief-notifications");
        setContent(null);
        const responseNotif = await fetch(`/api/brief-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${userExist?.name.italics()} has sent feedback on ${briefs?.title.italics()}`,
            briefId: briefs?.id,
            assign: briefs?.assign,
          }),
        });
        Router.refresh();
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

      // console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Brief updated successfully.");
        Router.refresh();
        mutate(`/api/briefs/${params.id}`);
        mutate("/api/brief-notifications");
        const responseNotif = await fetch(`/api/brief-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Status brief ${briefTitle.italics()} just updated to ${status.italics()}`,
            briefId: dataId,
            assign: assign,
          }),
        });
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

  const feedbacks = briefs?.feedback.map((data) => {
    const newContent = JSON.parse(data.content);
    const mappedData = { ...data, content: newContent };
    return mappedData;
  });

  // butuh refactor
  const defaultUserchips = !briefs
    ? []
    : //@ts-ignore
      [...briefs!.assign].map((user: any) => {
        const { id, name: text } = user;
        return {
          id,
          text,
        };
      });

  const handleSubmitBrief = async (data: any) => {
    setIsLoading(true);
    // console.log(data);
    try {
      // console.log(body);
      const response = await fetch(`/api/briefs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.Judul ? data.Judul : briefs?.title,
          deadline: data.Deadline ? data.Deadline : briefs?.deadline,
          content: JSON.stringify(data.Editor)
            ? JSON.stringify(data.Editor)
            : JSON.stringify(briefs?.content),
          assign: data.Assign ? data.Assign : briefs?.assign,
        }),
      });
      // console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Brief updated successfully.");
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

  return briefs && users && userExist ? (
    editMode ? (
      <Fragment>
        <div className="min-h-screen w-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <form
            className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4"
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
            </div>

            {/* <Divider className="my-10" /> */}

            <div className="flex flex-col gap-y-6">
              <Input
                type="text"
                className="w-full border-0 p-0 ring-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:capitalize text-[40px] font-bold"
                placeholder="Judul Brief..."
                //@ts-ignore
                defaultValue={briefs?.title}
                autoComplete="off"
                {...register("Judul")}
              />

              <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-start w-full">
                <div className="font-medium text-base flex gap-2 items-center w-full">
                  <CircleFadingPlus className="w-6 h-6" />
                  <Select //@ts-ignore
                    defaultValue={briefs?.status}
                    {...register("status")}
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Waiting for Client">
                        Waiting for Client
                      </SelectItem>
                      <SelectItem value="Correction">Correction</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Need Review">Need Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

                <Controller
                  control={control}
                  name="Deadline"
                  render={({ field }) => (
                    <DateRangePicker
                      mode="range"
                      setValue={{
                        //@ts-ignore
                        from: briefs?.deadline.from,
                        //@ts-ignore
                        to: briefs?.deadline.to,
                      }}
                      onChange={(range) => {
                        field.onChange(range);
                      }}
                    />
                  )}
                />

                <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

                {usersChip ? (
                  <div className="font-medium text-base flex gap-2 items-center w-full">
                    <Users className="w-6 h-6" />
                    <Controller
                      control={control}
                      name="Assign"
                      render={({ field }) => (
                        <Chips
                          defaultChipItems={defaultUserchips}
                          chipItems={usersChip}
                          onChange={(value) => {
                            field.onChange(
                              value.map((data) => ({ id: data.id }))
                            );
                          }}
                        />
                      )}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <Divider className="my-10" />

            <div className="border rounded-lg">
              <DndProvider backend={HTML5Backend}>
                <Controller
                  control={control}
                  name="Editor"
                  //@ts-ignore
                  defaultValue={briefs?.content}
                  render={({ field }) => (
                    <PlateEditor
                      // @ts-ignore
                      initialValue={briefs?.content}
                      onChange={(editorValue: any) => {
                        field.onChange(editorValue);
                      }}
                    />
                  )}
                />
              </DndProvider>
            </div>

            <div className="flex items-center justify-start gap-2">
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <SpokeSpinner size="sm" />
                    Loading...
                  </div>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* <DevTool control={control} /> */}
      </Fragment>
    ) : (
      <Fragment>
        <title>
          {title
            ? `${title} - Task Management System`
            : "Detail Brief - Task Management System"}
        </title>
        <div className="min-h-screen w-full flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <form className="mx-auto grid max-w-[59rem] lg:min-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center justify-between gap-4 mb-12">
              <Link href="/dashboard/briefs">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              {userExist.id === briefs.authorId ||
              userExist.role === "Admin" ? (
                editMode ? (
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setEditMode(false)}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <SpokeSpinner size="sm" />
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Brief
                        </div>
                      )}
                    </span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setEditMode(true)}
                    disabled={isLoading}
                    variant="default"
                  >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <SpokeSpinner size="sm" />
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Pencil className="w-4 h-4" />
                          Edit Brief
                        </div>
                      )}
                    </span>
                  </Button>
                )
              ) : null}
            </div>

            {/* <Divider className="my-10" /> */}

            <div className="flex flex-col gap-y-6">
              <div className="w-full border-0 p-0 ring-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent placeholder:capitalize text-[40px] font-bold">
                {briefs?.title}
              </div>

              <div className="flex gap-1 font-medium text-base items-center">
                <div className="flex gap-2 items-center">
                  <PenTool className="w-5 h-5" />
                  Created by
                </div>
                {users
                  ?.filter((user) => user.id === briefs?.authorId)
                  .map((user) => user.name)}
                <div>
                  at{" "}
                  {briefs?.createdAt && format(briefs?.createdAt, FORMAT_DATE)}
                </div>
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
                        <SelectItem value="Assigned">
                          <div className="flex items-center gap-2">
                            <MessageSquareDiff className="w-3.5 h-3.5" />
                            Assigned
                          </div>
                        </SelectItem>
                        <SelectItem value="In Review">
                          <div className="flex items-center gap-2">
                            <FileSearch className="w-3.5 h-3.5" />
                            In Review
                          </div>
                        </SelectItem>
                        <SelectItem value="Waiting for Client">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Waiting for Client
                          </div>
                        </SelectItem>
                        <SelectItem value="Correction">
                          <div className="flex items-center gap-2">
                            <SearchX className="w-3.5 h-3.5" />
                            Correction
                          </div>
                        </SelectItem>
                        <SelectItem value="In Progress" disabled>
                          <div className="flex items-center gap-2">
                            <Timer className="w-3.5 h-3.5" />
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="Need Review" disabled>
                          <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5" />
                            Need Review
                          </div>
                        </SelectItem>
                        <SelectItem value="Done">
                          <div className="flex items-center gap-2">
                            <CircleCheck className="w-3.5 h-3.5" />
                            Done
                          </div>
                        </SelectItem>
                      </SelectContent>
                    ) : (
                      <SelectContent>
                        <SelectItem value="Assigned" disabled>
                          <div className="flex items-center gap-2">
                            <MessageSquareDiff className="w-3.5 h-3.5" />
                            Assigned
                          </div>
                        </SelectItem>
                        <SelectItem value="In Review" disabled>
                          <div className="flex items-center gap-2">
                            <FileSearch className="w-3.5 h-3.5" />
                            In Review
                          </div>
                        </SelectItem>
                        <SelectItem value="Waiting for Client" disabled>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Waiting for Client
                          </div>
                        </SelectItem>
                        <SelectItem value="Correction" disabled>
                          <div className="flex items-center gap-2">
                            <SearchX className="w-3.5 h-3.5" />
                            Correction
                          </div>
                        </SelectItem>
                        <SelectItem value="In Progress">
                          <div className="flex items-center gap-2">
                            <Timer className="w-3.5 h-3.5" />
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="Need Review">
                          <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5" />
                            Need Review
                          </div>
                        </SelectItem>
                        <SelectItem value="Done" disabled>
                          <div className="flex items-center gap-2">
                            <CircleCheck className="w-3.5 h-3.5" />
                            Done
                          </div>
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
                Feedback (
                {
                  briefs?.feedback
                    .filter((data) => data.isReply === false)
                    .map((data) => data).length
                }
                )
              </CardTitle>
            </CardHeader>
            <DndProvider backend={HTML5Backend}>
              <CardContent>
                <form
                  className="grid w-full gap-2"
                  onSubmit={handleSubmit(handleSubmitFeedback)}
                >
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

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading}
                      variant="expandIcon"
                      Icon={SendHorizonal}
                      iconStyle="h-4 w-4"
                      iconPlacement="right"
                    >
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
              <CardContent>
                {feedbacks ? (
                  <div className="flex flex-col gap-3">
                    {feedbacks
                      .sort(function compare(a, b) {
                        var dateA = new Date(a.createdAt);
                        var dateB = new Date(b.createdAt);
                        // @ts-ignore
                        return dateA - dateB;
                      })
                      .filter((data) => data.isReply === false)
                      .map((data, i) => (
                        <div
                          key={i}
                          className={
                            data.status === "Not Approved"
                              ? "p-6 border border-slate-200 rounded-lg"
                              : "p-6 border border-slate-900 rounded-lg"
                          }
                        >
                          <Feedback
                            key={data.id}
                            feedbackId={data.id}
                            authorId={briefs.authorId}
                            user={users
                              ?.filter((user) => user.id === data.userId)
                              .map((user) => user.name)}
                            userSent={users
                              ?.filter((user) => user.id === data.userSentId)
                              .map((user) => user.name)}
                            role={users
                              ?.filter((user) => user.id === data.userId)
                              .map((user) => user.role)}
                            message={data.content}
                            time={formatDistanceToNow(data.createdAt)}
                            userExist={userExist}
                            userId={users
                              ?.filter((user) => user.id === data.userId)
                              .map((user) => user.id)}
                            userSentId={data.userSentId}
                            briefId={briefs?.id}
                            briefTitle={briefs?.title}
                            assignBrief={briefs?.assign}
                            isReply={data.isReply}
                            isEdited={data.isEdited}
                            replyId={data.replyId}
                            status={data.status}
                          />
                          {feedbacks.filter(
                            (dataReply) =>
                              dataReply.isReply === true &&
                              dataReply.replyId === data.replyId
                          ).length ? (
                            <Collapsible>
                              <CollapsibleTrigger>
                                <div className="text-xs font-semibold text-slate-500 hover:text-slate-950 transition duration-300 flex gap-1 items-end">
                                  Comments (
                                  {
                                    feedbacks.filter(
                                      (dataReply) =>
                                        dataReply.isReply === true &&
                                        dataReply.replyId === data.replyId
                                    ).length
                                  }
                                  )
                                  <CornerRightDown className="w-3 h-3" />
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="pl-6 border-l-4  border-l-slate-100">
                                  {feedbacks
                                    .sort(function compare(a, b) {
                                      var dateA = new Date(a.createdAt);
                                      var dateB = new Date(b.createdAt);
                                      // @ts-ignore
                                      return dateA - dateB;
                                    })
                                    .filter(
                                      (dataReply) =>
                                        dataReply.isReply === true &&
                                        dataReply.replyId === data.replyId
                                    )
                                    .map((dataReply) => (
                                      <>
                                        <Feedback
                                          key={dataReply.id}
                                          feedbackId={dataReply.id}
                                          user={users
                                            ?.filter(
                                              (user) =>
                                                user.id === dataReply.userId
                                            )
                                            .map((user) => user.name)}
                                          userSent={users
                                            ?.filter(
                                              (user) =>
                                                user.id === dataReply.userSentId
                                            )
                                            .map((user) => user.name)}
                                          role={users
                                            ?.filter(
                                              (user) =>
                                                user.id === dataReply.userId
                                            )
                                            .map((user) => user.role)}
                                          message={dataReply.content}
                                          time={formatDistanceToNow(
                                            dataReply.createdAt
                                          )}
                                          userExist={userExist}
                                          userId={users
                                            ?.filter(
                                              (user) =>
                                                user.id === dataReply.userId
                                            )
                                            .map((user) => user.id)}
                                          userSentId={dataReply.userSentId}
                                          briefId={briefs?.id}
                                          briefTitle={briefs?.title}
                                          assignBrief={briefs?.assign}
                                          isReply={dataReply.isReply}
                                          isEdited={dataReply.isEdited}
                                          replyId={data.replyId}
                                          status={dataReply.status}
                                          parentStatus={data.status}
                                        />
                                      </>
                                    ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ) : null}
                        </div>
                      ))}
                  </div>
                ) : null}
              </CardContent>
            </DndProvider>
          </Card>
        </div>

        {/* <DevTool control={control} /> */}
      </Fragment>
    )
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center gap-2">
        <SpokeSpinner size="md" />
        <span className="text-md font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}
