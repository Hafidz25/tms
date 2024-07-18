import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Whoops, looks like you took a wrong turn!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Don't worry, we'll get you back on the right path in no time!
        </p>
        <div className="mt-6">
          <Link href="/dashboard" prefetch={false}>
            <Button variant="ringHover">Take me home!</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
