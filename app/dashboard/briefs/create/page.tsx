"use client";

import { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { userList } from "@/data/user";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { DevTool } from "@hookform/devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ChevronLeft } from "lucide-react";
import { PlateEditor } from "@/components/plate-ui/plate-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chips } from "@/components/ui/chips";
import { Divider } from "@/components/ui/divider";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { SpokeSpinner } from "@/components/ui/spinner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CreateBrief() {
  const { control, register, handleSubmit } = useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [userExist, setUserExist] = useState<User>();
  const [loadExist, setLoadExist] = useState(false);
  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        setLoad(true);
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

  const handleSubmitBrief = async (data: any) => {
    setIsLoading(true);
    // console.log(data);
    try {
      // console.log(body);
      const response = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.Judul,
          deadline: data.Deadline,
          content: JSON.stringify(data.Editor),
          assign: data.Assign,
          authorId: data.authorId,
        }),
      });
      // console.log(response);
      if (response.status === 201) {
        setIsLoading(false);
        toast.success("Brief created successfully.");
        Router.push("/dashboard/briefs");
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

  return loadExist ? (
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
              autoComplete="off"
              {...register("Judul")}
            />

            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-start sm:max-w-2xl">
              <input
                type="hidden"
                {...register("status", {
                  value: "Assigned",
                })}
              />
              <input
                type="hidden"
                value={userExist?.id}
                {...register("authorId", {
                  value: userExist?.id,
                })}
              />

              <Controller
                control={control}
                name="Deadline"
                render={({ field }) => (
                  <DateRangePicker
                    mode="range"
                    onChange={(range) => {
                      field.onChange(range);
                    }}
                  />
                )}
              />

              <div className="hidden sm:block sm:w-1 h-1 sm:h-10 sm:border-r sm:border-t-0 border-t border-slate-300"></div>

              {load ? (
                <Controller
                  control={control}
                  name="Assign"
                  render={({ field }) => (
                    <Chips
                      chipItems={userChipList}
                      onChange={(value) => {
                        field.onChange(value.map((data) => ({ id: data.id })));
                      }}
                    />
                  )}
                />
              ) : null}
            </div>
          </div>

          <Divider className="my-10" />

          <div className="border rounded-lg">
            <DndProvider backend={HTML5Backend}>
              <Controller
                control={control}
                name="Editor"
                render={({ field }) => (
                  <PlateEditor
                    // @ts-ignore
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
                "Create brief"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* <DevTool control={control} /> */}
    </Fragment>
  ) : null;
}
