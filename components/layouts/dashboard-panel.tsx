import { cn } from "@/lib/utils"

export function DashboardPanel({ children, className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full py-10", className)}>
      <div className="container">{children}</div>
    </div>
  );
}