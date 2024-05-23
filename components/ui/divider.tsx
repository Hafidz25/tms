import { cn } from "@/lib/utils"

export function Divider(props: React.HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cn('overflow-visible border-l-0 border-b-0 border-solid border-slate-300 border-t inline-flex shrink w-full h-0', props.className)} />
}