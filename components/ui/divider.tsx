import { cn } from "@/lib/ui/";

export function Divider(props: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      {...props}
      className={cn(
        "inline-flex h-0 w-full shrink overflow-visible border-b-0 border-l-0 border-t border-solid border-slate-300",
        props.className,
      )}
    />
  );
}
