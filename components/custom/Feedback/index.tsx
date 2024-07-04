import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Reply,
  Trash2,
  Pencil,
  Save,
  MessageCircleReply,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpokeSpinner } from "@/components/ui/spinner";
import { PlateEditorFeedback } from "@/components/plate-ui/plate-editor-feedback";
import { PlateEditorFeedbackEdit } from "@/components/plate-ui/plate-editor-feedback-edit";

const Feedback = ({
  feedbackId,
  user,
  userSent,
  role,
  message,
  time,
  userExist,
  userId,
  userSentId,
  briefId,
  isReply,
  isEdited,
  briefTitle,
  assignBrief,
  replyId,
  status,
  parentStatus,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();
  const { control, register, handleSubmit } = useForm();
  const messageParse = message ? JSON.parse(message) : null;

  const handleDelete = async (feedbackId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Feedback deleted successfully.");
        // Router.refresh();
        location.reload();
      } else if (response.status === 403) {
        setIsLoading(false);
        toast.warning("You dont have access.");
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

  const handleUpdateStatus = async (feedbackId: string, status: string) => {
    setIsLoading(true);
    const newStatus = status === "Not Approved" ? "Approved" : "Not Approved";
    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Feedback status updated successfully.");
        // Router.refresh();
        location.reload();
      } else if (response.status === 403) {
        setIsLoading(false);
        toast.warning("You dont have access.");
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

  const handleEditFeedback = async (data: any) => {
    setIsLoading(true);
    const newData = {
      content: JSON.stringify(data.content),
      userId: userExist.id,
      briefId: briefId,
      isEdited: true,
    };

    // console.log(newData);
    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      // console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Feedback updated successfully.");
        // Router.push(`/dashboard/briefs/${feedbackId}`);
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

  const handleReplyFeedback = async (data: any) => {
    setIsLoading(true);
    const newData = {
      content: JSON.stringify(data.content),
      userId: userExist.id,
      briefId: briefId,
      userSentId: userId[0],
      isReply: true,
      replyId: replyId,
    };

    // console.log(newData);
    try {
      const response = await fetch(`/api/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      // console.log(response);
      if (response.status === 201) {
        setIsLoading(false);
        toast.success("Reply feedback sent successfully.");
        const responseNotif = await fetch(`/api/brief-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${userExist?.name.italics()} has reply feedback on ${briefTitle.italics()}`,
            briefId: briefId,
            assign: assignBrief,
          }),
        });
        // Router.push(`/dashboard/briefs/${feedbackId}`);
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

  return (
    <div className="flex flex-col gap-2  border-slate-200 py-2">
      <div className="flex gap-2 items-center">
        <div className="text-base font-semibold">{user}</div>
        <Badge variant="outline">{role}</Badge>
        {status !== "Default" ? (
          <Badge
            variant={status === "Not Approved" ? "secondary" : "default"}
            className="cursor-pointer flex gap-1 items-center"
            onClick={() => handleUpdateStatus(feedbackId, status)}
          >
            {status === "Not Approved" ? (
              <CircleAlert className="w-3.5 h-3.5" />
            ) : (
              <CircleCheck className="w-3.5 h-3.5" />
            )}
            {status}
          </Badge>
        ) : null}
      </div>
      <p className="text-sm">
        {isReply ? <Badge className="mr-2">@{userSent}</Badge> : null}
        <div className="flex items-center gap-3">
          {
            // @ts-ignore
            <PlateEditorFeedback initialValue={messageParse} readOnly />
          }
          {isEdited ? (
            <span className="text-xs text-slate-600 italic">edited</span>
          ) : null}
        </div>
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 me-3">{time} ago</span>
        {(userExist.id === userId[0] && status === "Not Approved") ||
        (userExist.id === userId[0] &&
          status === "Default" &&
          parentStatus === "Not Approved") ? (
          <Dialog>
            <DialogTrigger asChild>
              <Link
                href=""
                className="text-xs font-medium underline underline-offset-2 text-slate-600 hover:text-slate-900 transition duration-150"
              >
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pencil className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50%]">
              <DialogHeader>
                <DialogTitle>Edit feedback message</DialogTitle>
              </DialogHeader>
              <form
                className="grid w-full gap-2"
                onSubmit={handleSubmit(handleEditFeedback)}
              >
                <div className="border rounded-lg">
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <PlateEditorFeedbackEdit
                        // @ts-ignore
                        initialValue={messageParse ? messageParse : null}
                        onChange={(editorValue: any) => {
                          field.onChange(editorValue);
                        }}
                      />
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                    variant="expandIcon"
                    Icon={Save}
                    iconStyle="h-4 w-4"
                    iconPlacement="left"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <SpokeSpinner size="sm" />
                        Loading...
                      </div>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}

        {(userExist.id !== userId[0] && status === "Not Approved") ||
        (userExist.id !== userId[0] &&
          status === "Default" &&
          parentStatus === "Not Approved") ? (
          <Dialog>
            <DialogTrigger asChild>
              <Link
                href=""
                className="text-xs font-medium underline underline-offset-2 text-slate-600 hover:text-slate-900 transition duration-150"
              >
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Reply className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reply</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50%]">
              <DialogHeader>
                <DialogTitle>Reply feedback message</DialogTitle>
              </DialogHeader>
              <form
                className="grid w-full gap-2"
                onSubmit={handleSubmit(handleReplyFeedback)}
              >
                <div className="border rounded-lg">
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <PlateEditorFeedbackEdit
                        // @ts-ignore
                        onChange={(editorValue: any) => {
                          field.onChange(editorValue);
                        }}
                      />
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                    variant="expandIcon"
                    Icon={MessageCircleReply}
                    iconStyle="h-4 w-4"
                    iconPlacement="left"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <SpokeSpinner size="sm" />
                        Loading...
                      </div>
                    ) : (
                      "Send reply"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}

        {(userExist.id === userId[0] && status === "Not Approved") ||
        (userExist.id === userId[0] &&
          status === "Default" &&
          parentStatus === "Not Approved") ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Link
                href=""
                className="text-xs font-medium underline underline-offset-2 text-red-600 hover:text-red-900 transition duration-150"
              >
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Trash2 className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete data</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure to delete this feedback?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => handleDelete(feedbackId)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <SpokeSpinner size="sm" />
                      Loading...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
};

export default Feedback;
