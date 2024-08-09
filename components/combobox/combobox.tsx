import { Check, ChevronDown } from "lucide-react";
import {
  Combobox as ComboboxPrimitive,
  ComboboxInput,
  ComboboxOption as ComboboxOptionPrimitive,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";

import { cn } from "@/lib/ui";
import { ComboboxProps, useCombobox } from "./use-combobox";

/**
 * @todo fix search query for multiple mode (table filtering)
 * @todo default values
 * @todo utils `createComboboxOptions` & `createComboboxDefaultOptions`
 * @todo testing
 * 
 * @todo feat: custom values. (menambahkan option baru dari user)
 */

export function Combobox({
  options: dataOptions,
  mode = "single",
  ...props
}: ComboboxProps) {
  const { selected, options, isMultiple, inputDisplayValue, dispatch } =
    useCombobox(dataOptions, mode);
  
  const originComboboxPrimitiveProps = props as React.ComponentProps<typeof ComboboxOptionPrimitive>;

  return (
    <div className="mx-auto h-screen w-52 pt-20">
      <ComboboxPrimitive
        {...originComboboxPrimitiveProps}
        multiple={isMultiple}
        value={selected}
        onChange={(value) => {
          dispatch({
            type: "root_change",
            payload: value,
          });
        }}
        onClose={() => {
          dispatch({
            type: "root_close",
          });
        }}
      >
        <div className="relative">
          <ComboboxInput
            autoComplete="off"
            placeholder="Select option..."
            className={cn(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pl-3 pr-8 text-sm/6 text-white",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
            displayValue={inputDisplayValue}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              dispatch({
                type: "input_change",
                payload: event.currentTarget.value,
              });
            }}
          />

          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDown className="size-4 text-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={cn(
            "w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
          )}
        >
          {options.map((option) => (
            <ComboboxOptionPrimitive
              key={option?.id}
              value={option}
              className="group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
            >
              <Check
                className={cn(
                  "size-4 text-white",
                  option?.check ? "visible" : "invisible",
                )}
              />
              <div className="text-sm/6 text-white">{option?.label}</div>
            </ComboboxOptionPrimitive>
          ))}
        </ComboboxOptions>
      </ComboboxPrimitive>
    </div>
  );
}
