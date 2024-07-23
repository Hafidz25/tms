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

interface ChipsProps {
  chipItems: ChipItemProps[];
  /** digunakan untuk meneruskan nilai yang dipilih */
  onChange?: (value: ChipItemProps[]) => void;
  disable?: boolean;

  // butuh refactor
  defaultChipItems?: ChipItemProps[];
}

function Chips({
  disable = false,
  chipItems,
  onChange,
  defaultChipItems,
}: ChipsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chips, setChips] = useState<{
    selected: ChipItemProps[] | null;
    list: ChipItemProps[];
  }>({
    selected: !!defaultChipItems?.length ? [...defaultChipItems] : null,
    list: !!defaultChipItems?.length
      ? [...chipItems.filter((user) => user.id !== defaultChipItems[0].id)]
      : [...chipItems],
  });

  const handleUnselect = (chipId: string) => {
    if (!chips.selected) return;

    setChips((prevChips) => {
      return {
        //@ts-ignore
        selected: prevChips.selected.filter((c) => c.id !== chipId),
        list: [
          ...prevChips.list,
          chipItems.filter((ci) => ci.id === chipId)[0],
        ],
      };
    });
  };

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
    let nextSelected;

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

    // @ts-ignore
    if (onChange) onChange(nextSelected);
  };

  const shouldOpen = open && !!chips.list.length;

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm  rounded-md">
        <div className="flex gap-1.5 flex-wrap">
          {/* Need help here */}
          {chips.selected &&
            chips.selected.map((chip) => {
              return (
                <Badge key={chip.id} variant="secondary">
                  {chip.text}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(chip.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(chip.id)}
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
            placeholder="Select users..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>

      {shouldOpen && (
        <div className="relative">
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
                      onSelect={(value) => {
                        const [text, id] = value.split(chipValueSeparator);
                        const nextValue = {
                          id,
                          text: text.split("_").join(" "),
                        };

                        handleSelect(nextValue);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
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
