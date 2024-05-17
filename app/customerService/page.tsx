import Navbar from "@/components/custom/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        Customer Service
      </main>
    </div>
  );
};

export default Page;
