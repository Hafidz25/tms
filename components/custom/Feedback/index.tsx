import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Reply, Trash2, Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Feedback = ({
  feedbackId,
  user,
  role,
  tag,
  message,
  time,
  userExist,
  userId,
  briefId,
}: any) => {
  const { toast } = useToast();
  const Router = useRouter();
  const { control, register, handleSubmit } = useForm();

  const handleDelete = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Feedback deleted successfully.",
        });
        // Router.refresh();
        location.reload();
      } else if (response.status === 403) {
        toast({
          title: "Error",
          description: "You dont have access.",
          variant: "destructive",
        });
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

  const handleEditFeedback = async (data: any) => {
    const newData = {
      ...data,
      userId: userExist,
      briefId: briefId,
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
        toast({
          title: "Success",
          description: "Feedback updated successfully.",
        });
        // Router.push(`/dashboard/briefs/${feedbackId}`);
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

  return (
    <div className="flex flex-col gap-2  border-slate-200 py-2">
      <div className="flex gap-2 items-center">
        <div className="text-base font-semibold">{user}</div>
        <Badge variant="outline">{role}</Badge>
      </div>
      <p className="text-sm">
        {tag ? <Badge className="mr-2">@{tag}</Badge> : null}
        {message}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 me-3">{time} ago</span>
        {/* <Link
          href=""
          className="text-xs font-medium underline underline-offset-2 text-slate-600 hover:text-slate-900 transition duration-150"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Reply className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link> */}

        {userExist === userId[0] ? (
          <Dialog>
            <DialogTrigger asChild>
              <Link
                href=""
                className="text-xs font-medium underline underline-offset-2 text-slate-600 hover:text-slate-900 transition duration-150"
              >
                <TooltipProvider>
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit feedback message</DialogTitle>
              </DialogHeader>
              <form
                className="grid w-full gap-2"
                onSubmit={handleSubmit(handleEditFeedback)}
              >
                <Textarea
                  placeholder="Type your message here."
                  {...register("content")}
                  defaultValue={message}
                />

                {/* <div className="flex justify-start">
                  <Button type="submit">Save changes</Button>
                </div> */}
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}

        {userExist === userId[0] ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Link
                href=""
                className="text-xs font-medium underline underline-offset-2 text-red-600 hover:text-red-900 transition duration-150"
              >
                <TooltipProvider>
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
                  Are you sure to delete data feedback &quot;{message}
                  &quot;?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => handleDelete(feedbackId)}
                >
                  Delete
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
