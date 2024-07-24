import { Fragment } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - Task Management System",
    default: "Payslips",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <main>{children}</main>
    </Fragment>
  );
}
