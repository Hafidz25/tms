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

import { split, capitalize } from "lodash-es";
import { nanoid } from "nanoid";

import { LinkProps } from "next/link";

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
  return (
    <Fragment>
      {NAVS.map((nav) => (
        <Link
          {...nav}
          key={nav.id}
          href={nav.href}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {nav.location}
        </Link>
      ))}
    </Fragment>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
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
                <span className="pl-2 text-sm font-bold">Abaz</span>
                <Badge variant={"secondary"}> Team Member </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Navbar;
