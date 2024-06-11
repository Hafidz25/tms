import { Fragment } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
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
