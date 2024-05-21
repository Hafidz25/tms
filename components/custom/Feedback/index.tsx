import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Feedback = ({ user, role, tag, message, time }: any) => {
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
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-600">{time} ago</span>
        <Link
          href="#"
          className="text-xs font-medium underline underline-offset-2 text-slate-600 hover:text-slate-900 transition duration-150"
        >
          Reply
        </Link>
      </div>
    </div>
  );
};

export default Feedback;
