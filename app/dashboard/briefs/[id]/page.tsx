"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { userList } from "@/data/user";
import {
  Calendar,
  Users,
  CircleFadingPlus,
  PenTool,
  SendHorizonal,
} from "lucide-react";

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
import Feedback from "@/components/custom/Feedback";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { SpokeSpinner } from "@/components/ui/spinner";
import generator from "generate-password";
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
  status: string;
  isReply: boolean;
  replyId: string;
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

  const [title, setTitle] = useState(null);
  const FORMAT_DATE = "dd LLL, y";
  const Router = useRouter();

  // const session = await getSession();
  // console.log(briefs);

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
        const responseNotif = await fetch(`/api/brief-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${userExist?.name.italics()} has sent feedback on ${briefs?.title.italics()}`,
            briefId: briefs?.id,
            assign: briefs?.assign,
          }),
        });
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
                Created by
              </div>
              {users
                .filter((user) => user.id === briefs?.authorId)
                .map((user) => user.name)}
              <div>
                at {briefs?.createdAt && format(briefs?.createdAt, FORMAT_DATE)}
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
              <div className="flex flex-col gap-3">
                {briefs?.feedback
                  .sort(function compare(a, b) {
                    var dateA = new Date(a.createdAt);
                    var dateB = new Date(b.createdAt);
                    // @ts-ignore
                    return dateA - dateB;
                  })
                  .filter((data) => data.isReply === false)
                  .map((data) => (
                    <div
                      className={
                        data.status === "Not Approved"
                          ? "p-6 border border-slate-200 rounded-lg"
                          : "p-6 border border-slate-900 rounded-lg"
                      }
                    >
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
                        userExist={userExist}
                        userId={users
                          .filter((user) => user.id === data.userId)
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
                      <div className="pl-6 border-l-4  border-l-slate-100">
                        {briefs.feedback
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
                                  .filter(
                                    (user) => user.id === dataReply.userId
                                  )
                                  .map((user) => user.name)}
                                userSent={users
                                  .filter(
                                    (user) => user.id === dataReply.userSentId
                                  )
                                  .map((user) => user.name)}
                                role={users
                                  .filter(
                                    (user) => user.id === dataReply.userId
                                  )
                                  .map((user) => user.role)}
                                message={dataReply.content}
                                time={formatDistanceToNow(dataReply.createdAt)}
                                userExist={userExist}
                                userId={users
                                  .filter(
                                    (user) => user.id === dataReply.userId
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
                    </div>
                  ))}
              </div>
            </CardContent>
          </DndProvider>
        </Card>
      </div>

      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
