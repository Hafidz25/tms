"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react";
import {
  CircleUser,
  Menu,
  Package2,
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { split, capitalize } from "lodash-es";
import { nanoid } from "nanoid";

import { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "next-auth/react";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface NavProp extends LinkProps {
  id?: string;
  location?: string | null;
}

function nav({
  href,
  id = "",
  location = null,
  replace = false,
  scroll = true,
  prefetch = undefined,
}: NavProp) {
  const result: NavProp = { href };

  result.id = !id ? nanoid(3) : id;
  result.replace = replace;
  result.scroll = scroll;
  result.prefetch = prefetch;

  // Perlu refactor & testing
  result.location = location ?? capitalize(split(href as string, "/")[0]);

  return result;
}

const NAVS = [
  nav({ href: "/dashboard", location: "Home" }),
  nav({ href: "/dashboard/users", location: "Users" }),
  nav({ href: "/dashboard/briefs", location: "Briefs" }),
];

// perlu refactor
function NavbarBrand() {
  return (
    <Link
      href="/dashboard"
      className="min-w-max flex items-center gap-2 text-lg font-semibold md:text-base"
    >
      <Package2 className="h-6 w-6" />
      Task Management
    </Link>
  );
}

function NavbarMenu({ data }: any) {
  const pathname = usePathname();
  // console.log(pathname);

  return (
    <Fragment>
      {data.role === "Admin" ? (
        <>
          {NAVS.map((nav) =>
            pathname === "/dashboard" ? (
              <Link
                replace={nav.replace}
                scroll={nav.scroll}
                prefetch={nav.prefetch}
                key={nav.id}
                href={nav.href}
                className={`${
                  pathname === nav.href ? "text-slate-800" : "text-slate-400"
                } transition-colors hover:text-slate-800`}
              >
                {nav.location}
              </Link>
            ) : (
              <Link
                replace={nav.replace}
                scroll={nav.scroll}
                prefetch={nav.prefetch}
                key={nav.id}
                href={nav.href}
                className={`${
                  //@ts-ignore
                  pathname.includes(nav.href) === true &&
                  nav.href !== "/dashboard"
                    ? "text-slate-800"
                    : "text-slate-400"
                } transition-colors hover:text-slate-800`}
              >
                {nav.location}
              </Link>
            )
          )}
        </>
      ) : (
        <>
          {NAVS.filter((data) => !data.location?.includes("Users")).map((nav) =>
            pathname === "/dashboard" ? (
              <Link
                replace={nav.replace}
                scroll={nav.scroll}
                prefetch={nav.prefetch}
                key={nav.id}
                href={nav.href}
                className={`${
                  pathname === nav.href ? "text-slate-800" : "text-slate-400"
                } transition-colors hover:text-slate-800`}
              >
                {nav.location}
              </Link>
            ) : (
              <Link
                replace={nav.replace}
                scroll={nav.scroll}
                prefetch={nav.prefetch}
                key={nav.id}
                href={nav.href}
                className={`${
                  //@ts-ignore
                  pathname.includes(nav.href) === true &&
                  nav.href !== "/dashboard"
                    ? "text-slate-800"
                    : "text-slate-400"
                } transition-colors hover:text-slate-800`}
              >
                {nav.location}
              </Link>
            )
          )}
        </>
      )}
    </Fragment>
  );
}

interface BriefNotification {
  id: string;
  message: string;
  briefId: string;
  assign: [
    {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  ];
  read: boolean;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// perlu refactor
function Navbar({ user }: any) {
  const [briefNotif, setBriefNotif] = useState<BriefNotification[]>([]);
  const [load, setLoad] = useState(false);
  const { toast } = useToast();
  const Router = useRouter();

  useEffect(() => {
    const fetchNotif = async () => {
      await fetch(`/api/brief-notifications`)
        .then((response) => response.json())
        .then((data) => {
          setBriefNotif(data.data);
          setLoad(true);
        });
    };

    // const fetchNotif = async () => {
    //   const { data: BriefNotification, error } = await supabase
    //     .from("BriefNotification")
    //     .select("*, _BriefNotificationToUser(*, User(*))")
    //     .order("createdAt", { ascending: false });
    //   if (error) {
    //     console.error("Error fetching posts:", error);
    //   } else {
    //     setBriefNotif(BriefNotification);
    //     setLoad(true);
    //   }
    // };
    fetchNotif();

    // const subscription = supabase
    //   .channel("brief-notif-insert-channel")
    //   .on(
    //     "postgres_changes",
    //     { event: "INSERT", schema: "public", table: "BriefNotification" },
    //     (payload) => {
    //       console.log("Change received!", payload);
    //       setBriefNotif([...briefNotif, payload.new as BriefNotification]);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(subscription);
    // };
  }, []);

  const updateNotif = async (dataId: string, briefId: string) => {
    try {
      const response = await fetch(`/api/brief-notifications/${dataId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      // console.log(response);
      if (response.status === 200) {
        // toast({
        //   title: "Success",
        //   description: "Notification read successfully.",
        // });
        await fetch(`/api/brief-notifications`)
          .then((response) => response.json())
          .then((data) => {
            setBriefNotif(data.data);
            setLoad(true);
          });
        briefId
          ? Router.push(`/dashboard/briefs/${briefId}`)
          : Router.refresh();
        // Router.refresh();
        // location.reload();
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

  // console.log(briefNotif);

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-8 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:w-full md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <NavbarBrand />

        <div className="flex w-full gap-5 justify-end">
          <NavbarMenu data={user.user} />
        </div>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <NavbarBrand />
            <NavbarMenu data={user.user} />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="md:ml-auto flex gap-2 md:w-auto w-full justify-end">
        {load ? (
          user?.user.role === "Admin" ||
          user?.user.role === "Customer Service" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Notif"
                  variant="ghost"
                  size="icon"
                  className="rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 relative"
                >
                  <Bell className="h-5 w-5" />
                  {briefNotif.filter((data) => data.read === false).length >
                  0 ? (
                    <div className="w-2 h-2 rounded-full bg-red-600 absolute right-3 top-2"></div>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 ms-4 md:w-96" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">
                        Unread
                        {briefNotif.filter((data) => data.read === false)
                          .length > 0 ? (
                          <Badge className="ms-2">
                            {
                              briefNotif.filter((data) => data.read === false)
                                .length
                            }
                          </Badge>
                        ) : null}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <ScrollArea className="h-96 rounded-md">
                        <div className="flex flex-col gap-2">
                          {briefNotif.map((data) => (
                            <Card
                              className={
                                data.read === false
                                  ? "bg-slate-50 cursor-pointer"
                                  : "bg-white cursor-pointer hover:bg-slate-100 transition duration-200"
                              }
                              key={data.id}
                              onClick={() => updateNotif(data.id, data.briefId)}
                            >
                              <CardHeader className="p-4">
                                <CardDescription>
                                  <div className="flex gap-4 items-start w-full">
                                    <div className="bg-slate-100 p-4 rounded-md">
                                      <Package2 className="h-6 w-6" />
                                    </div>
                                    <div className="w-full">
                                      <div
                                        className="text-black text-md"
                                        dangerouslySetInnerHTML={{
                                          __html: data.message,
                                        }}
                                      >
                                        {/* {data.message} */}
                                        {/* {data.assign
                                        .map((user) => user.name)
                                        .join(", ")} */}
                                      </div>
                                      <span className="text-xs font-normal">
                                        {formatDistanceToNow(data.createdAt)}
                                      </span>
                                    </div>
                                    {data.read === false ? (
                                      <div className="flex justify-end">
                                        <Badge>New</Badge>
                                      </div>
                                    ) : null}
                                  </div>
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="unread">
                      <ScrollArea className="h-96 rounded-md">
                        <div className="flex flex-col gap-2">
                          {briefNotif
                            .filter((data) => data.read === false)
                            .map((data) => (
                              <Card
                                className={
                                  data.read === false
                                    ? "bg-slate-50 cursor-pointer"
                                    : "bg-white cursor-pointer hover:bg-slate-100 transition duration-200"
                                }
                                key={data.id}
                                onClick={() =>
                                  updateNotif(data.id, data.briefId)
                                }
                              >
                                <CardHeader className="p-4">
                                  <CardDescription>
                                    <div className="flex gap-4 items-start w-full">
                                      <div className="bg-slate-100 p-4 rounded-md">
                                        <Package2 className="h-6 w-6" />
                                      </div>
                                      <div className="w-full">
                                        <div
                                          className="text-black text-md"
                                          dangerouslySetInnerHTML={{
                                            __html: data.message,
                                          }}
                                        >
                                          {/* {data.message} */}
                                          {/* {data.assign
                                          .map((user) => user.name)
                                          .join(", ")} */}
                                        </div>
                                        <span className="text-xs font-normal">
                                          {formatDistanceToNow(data.createdAt)}
                                        </span>
                                      </div>
                                      {data.read === false ? (
                                        <div className="flex justify-end">
                                          <Badge>New</Badge>
                                        </div>
                                      ) : null}
                                    </div>
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label="Notif"
                  size="icon"
                  className="rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 relative"
                >
                  <Bell className="h-5 w-5" />
                  {briefNotif.filter(
                    (data) =>
                      data.read === false &&
                      data.assign.find(({ id }) => id === user?.user.id)
                  ).length > 0 ? (
                    <div className="w-2 h-2 rounded-full bg-red-600 absolute right-3 top-2"></div>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 ms-4 md:w-96" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">
                        Unread
                        {briefNotif.filter(
                          (data) =>
                            data.read === false &&
                            data.assign.find(({ id }) => id === user?.user.id)
                        ).length > 0 ? (
                          <Badge className="ms-2">
                            {
                              briefNotif.filter(
                                (data) =>
                                  data.read === false &&
                                  data.assign.find(
                                    ({ id }) => id === user?.user.id
                                  )
                              ).length
                            }
                          </Badge>
                        ) : null}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <ScrollArea className="h-96 rounded-md">
                        <div className="flex flex-col gap-2">
                          {briefNotif
                            .filter((data) =>
                              data.assign.find(({ id }) => id === user?.user.id)
                            )
                            .map((data) => (
                              <Card
                                className={
                                  data.read === false
                                    ? "bg-slate-50 cursor-pointer"
                                    : "bg-white cursor-pointer hover:bg-slate-100 transition duration-200"
                                }
                                key={data.id}
                                onClick={() =>
                                  updateNotif(data.id, data.briefId)
                                }
                              >
                                <CardHeader className="p-4">
                                  <CardDescription>
                                    <div className="flex gap-4 items-start w-full">
                                      <div className="bg-slate-100 p-4 rounded-md">
                                        <Package2 className="h-6 w-6" />
                                      </div>
                                      <div className="w-full">
                                        <div
                                          className="text-black text-md"
                                          dangerouslySetInnerHTML={{
                                            __html: data.message,
                                          }}
                                        >
                                          {/* {data.message} */}
                                          {/* {data.assign
                                        .map((user) => user.name)
                                        .join(", ")} */}
                                        </div>
                                        <span className="text-xs font-normal">
                                          {formatDistanceToNow(data.createdAt)}
                                        </span>
                                      </div>
                                      {data.read === false ? (
                                        <div className="flex justify-end">
                                          <Badge>New</Badge>
                                        </div>
                                      ) : null}
                                    </div>
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="unread">
                      <ScrollArea className="h-96 rounded-md">
                        <div className="flex flex-col gap-2">
                          {briefNotif
                            .filter(
                              (data) =>
                                data.read === false &&
                                data.assign.find(
                                  ({ id }) => id === user?.user.id
                                )
                            )
                            .map((data) => (
                              <Card
                                className={
                                  data.read === false
                                    ? "bg-slate-50 cursor-pointer"
                                    : "bg-white cursor-pointer hover:bg-slate-100 transition duration-200"
                                }
                                key={data.id}
                                onClick={() =>
                                  updateNotif(data.id, data.briefId)
                                }
                              >
                                <CardHeader className="p-4">
                                  <CardDescription>
                                    <div className="flex gap-4 items-start w-full">
                                      <div className="bg-slate-100 p-4 rounded-md">
                                        <Package2 className="h-6 w-6" />
                                      </div>
                                      <div className="w-full">
                                        <div
                                          className="text-black text-md"
                                          dangerouslySetInnerHTML={{
                                            __html: data.message,
                                          }}
                                        >
                                          {/* {data.message} */}
                                          {/* {data.assign
                                          .map((user) => user.name)
                                          .join(", ")} */}
                                        </div>
                                        <span className="text-xs font-normal">
                                          {formatDistanceToNow(data.createdAt)}
                                        </span>
                                      </div>
                                      {data.read === false ? (
                                        <div className="flex justify-end">
                                          <Badge>New</Badge>
                                        </div>
                                      ) : null}
                                    </div>
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          <Button
            aria-label="Notif"
            variant="ghost"
            size="icon"
            className="rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Bell className="h-5 w-5" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-y-1">
                <span className="pl-2 text-sm font-bold">
                  {user?.user.name}
                </span>
                <Badge className="w-fit" variant={"secondary"}>
                  {" "}
                  {user?.user.role}{" "}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <Link href="" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </Link>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sign Out</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to sign out?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button type="reset" variant="outline">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={() =>
                        signOut({
                          redirect: true,
                          callbackUrl: `${window.location.origin}/signin`,
                        })
                      }
                      variant="destructive"
                    >
                      Sign out
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Navbar;
