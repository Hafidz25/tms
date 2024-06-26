import { Fragment } from "react";
import { Navbar } from "@/components/navbar";
import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - Task Management System",
    default: "Dashboard",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOption);
  // console.log(session);

  return (
    <Fragment>
      <Navbar user={session} />

      <main>{children}</main>
    </Fragment>
  );
}
