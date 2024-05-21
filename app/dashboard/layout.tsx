import { Fragment } from "react";
import { Navbar } from "@/components/layouts/navbar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <Fragment>
      <Navbar />
      
      <main>
        {children}
      </main>
    </Fragment>
  )
}