"use client";

import React, { useState, useRef, useCallback, SetStateAction } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export interface ChipItemProps {
  id: string;
  text: string;
  [key: string]: any;
}

interface ChipsProps extends React.ComponentProps<typeof Command> {
  items: ChipItemProps[];

  /** Digunakan untuk menentukan nilai default component. */
  defaultValues?: ChipItemProps[];

  /** Digunakan untuk mematikan component. */
  disable?: boolean;

  /** Digunakan untuk menambahkan placeholder pada chips input. */
  placeholder?: string;

  /**
   * Digunakan untuk testing
   * @todo `testId` Properti seharusnya digunakan menggunakan HOC pattern
   * */
  testId?: string | number;
}

function Chips({
  defaultValues = [],
  disable = false,
  placeholder = "",
  items,
  testId,
  ...props
}: ChipsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chips, setChips] = useState({
    selected: [...defaultValues],
    list: [...items],
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const handleSelect = (nextValue: ChipItemProps) => {
    setInputValue("");
    let nextSelected: ChipItemProps[] = [];

    setChips((c) => {
      if (!c.selected) {
        nextSelected = [nextValue];
      } else {
        nextSelected = [...c.selected, nextValue];
      }

      return {
        selected: nextSelected,
        list: [...c.list.filter((ci) => ci.id !== nextValue.id)],
      };
    });

    // @ts-ignore : perlu refactor
    if (props.onChange) props.onChange(nextSelected);
  };

  const handleUnselect = (chipId: string) => {
    if (!chips.selected) return;

    setChips((prevChips) => {
      return {
        selected: prevChips.selected.filter((c) => c.id !== chipId),
        list: [items.filter((ci) => ci.id === chipId)[0], ...prevChips.list],
      };
    });
  };

  const shouldOpen = open && !!chips.list.length;

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
      {...props}
    >
      <div className="group border border-input px-3 py-2 text-sm  rounded-md">
        <div className="flex gap-1.5 flex-wrap">
          {/* Need help here */}
          {!!chips.selected.length &&
            chips.selected.map((chip) => {
              return (
                <Badge key={chip.id} variant="secondary">
                  {chip.text}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => handleUnselect(chip.id)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}

          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            disabled={disable}
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>

      {/* attribute `data-testId` seharusnya diterapkan menggunakan HOC pattern */}
      {shouldOpen && (
        <div
          className="relative"
          {...(testId ? { "data-test-id": testId } : {})}
        >
          <div className="absolute w-full z-[60] top-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="bg-white h-full max-h-[250px] overflow-auto">
              <CommandList>
                {chips.list.map((chip) => {
                  const chipValueSeparator = "-";
                  const textValue = chip.text.split(" ").join("_");

                  return (
                    <CommandItem
                      key={chip.id}
                      value={`${textValue}${chipValueSeparator}${chip.id}`}
                      className={"cursor-pointer"}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        const [text, id] = value.split(chipValueSeparator);
                        const nextValue = {
                          id,
                          text: text.split("_").join(" "),
                        };

                        handleSelect(nextValue);
                      }}
                    >
                      {chip.text}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </CommandGroup>
          </div>
        </div>
      )}
    </Command>
  );
}

export { Chips };
