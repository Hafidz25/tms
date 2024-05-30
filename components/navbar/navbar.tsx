"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react";
import { CircleUser, Menu, Package2 } from "lucide-react";
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

import { split, capitalize } from "lodash-es";
import { nanoid } from "nanoid";

import { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "next-auth/react";

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

function NavbarMenu() {
  const pathname = usePathname();

  return (
    <Fragment>
      {NAVS.map((nav) => (
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
      ))}
    </Fragment>
  );
}

// perlu refactor
function Navbar({ user }: any) {
  const { toast } = useToast();
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-8">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:w-full md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <NavbarBrand />

        <div className="flex w-full gap-5 justify-end">
          <NavbarMenu />
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
            <NavbarMenu />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="md:ml-auto md:block md:w-auto flex w-full justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-y-1">
                <span className="pl-2 text-sm font-bold">
                  {user?.user.name}
                </span>
                <Badge variant={"secondary"}> {user?.user.role} </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <Link href="" className="w-full">
                    Sign out
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

            {/* {user ? (
              <DropdownMenuItem>
                <Link
                  href=""
                  onClick={() =>
                    signOut({
                      redirect: true,
                      callbackUrl: `${window.location.origin}/signin`,
                    })
                  }
                >
                  Sign Out
                </Link>
              </DropdownMenuItem>
            ) : null} */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Navbar;
