import { cn } from "@/lib/utils";

export function LoadDashboardPanel() {
  return (
    <div className="animate-pulse w-full h-96 p-10 flex flex-col gap-y-6 bg-slate-100 rounded-md">
      <div className="bg-slate-200 h-8 w-full rounded-md"></div>
      <div className="bg-slate-200 h-8 w-full rounded-md"></div>
    </div>
  )
}

export function DashboardPanel({ children, className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full py-10", className)}>
      <div className="container">{children}</div>
    </div>
  );
}