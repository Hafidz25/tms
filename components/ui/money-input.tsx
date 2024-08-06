import * as React from "react";

import { cn } from "@/lib/ui";
import CurrencyInput from "react-currency-input-field";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: String;
}

const MoneyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, currency, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        {currency}
        {
          //@ts-ignore
          <CurrencyInput
            {...props}
            type={type}
            ref={ref}
            className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        }
      </div>
    );
  }
);
MoneyInput.displayName = "Input";

export { MoneyInput };
