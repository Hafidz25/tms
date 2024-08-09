import { useMemo, useReducer } from "react";
import { matchSorter } from "match-sorter";
import { isModeMultiple } from "@/lib/combobox/type-guard";
import { Combobox } from "@headlessui/react";

type ComboboxMode = "single" | "multiple";

type ComboboxActionType = "root_change" | "root_close" | "input_change";

interface ComboboxActions {
  type: ComboboxActionType;
  payload?: any;
}

interface ComboboxBaseState {
  selected: MappedComboboxOption | MappedComboboxOption[] | undefined;
  queryOptions: string;
}

export interface ComboboxOption {
  id: string | number;
  label: string;
}

export interface MappedComboboxOption extends ComboboxOption {
  value: string;
  check: boolean;
}

export interface ComboboxProps extends React.ComponentProps<typeof Combobox> {
  options: ComboboxOption[];
  mode?: "single" | "multiple";
}

const STRING_MULTIPLE_MODE_SEPARATOR = ', ';

const DEFAULT_COMBOBOX_BASE_STATE: ComboboxBaseState = {
  selected: undefined,
  queryOptions: "",
};

function comboboxReducer(
  state: ComboboxBaseState,
  actions: ComboboxActions,
): ComboboxBaseState {
  switch (actions.type) {
    case "root_change": {
      /**
       * Jika multiple mode aktif, nilai berupa array.
       * Jika tidak, array berupa object.
       */
      const value = actions.payload as unknown;

      // Multiple mode
      if (Array.isArray(value)) {
        const selected = (value as MappedComboboxOption[]).map((option) => ({
          ...option,
          check: true,
        }));

        return {
          ...state,
          selected,
        };
      }

      // Single Mode
      const selectedValue = {
        ...(value as MappedComboboxOption),
        check: true,
      };

      return {
        ...state,
        selected: selectedValue,
      };
    }

    case "root_close": {
      return {
        ...state,
        queryOptions: "",
      };
    }

    case "input_change": {
      const value = actions.payload as string;
      return {
        ...state,
        queryOptions: value,
      };
    }

    default: {
      throw new Error(`Action ${actions.type} tidak diketahui!`);
    }
  }
}

export function useCombobox(options: ComboboxOption[], mode: ComboboxMode) {
  if (!options) throw new Error("Data options tidak boleh kosong!");

  const dataOptions = useMemo(() => {
    const result = options.map((option) => ({
      ...option,
      value: option.label.toLowerCase(),
      check: false,
    })) satisfies MappedComboboxOption[];
    return result;
  }, [options]);

  const [combobox, dispatch] = useReducer(
    comboboxReducer,
    DEFAULT_COMBOBOX_BASE_STATE,
  );
  
  const filteredOptions = matchSorter(dataOptions, combobox.queryOptions, {
    keys: ["value"],
  }).map((option) => {
    switch (mode) {
      case "single": {
        if ((combobox.selected as MappedComboboxOption)?.id === option.id)
          return combobox.selected;
        return option;
      }

      case "multiple": {
        const selected = combobox.selected as MappedComboboxOption[];

        if (!selected) return option;

        const originSelectedOption = selected.find((so) => option.id === so.id);

        if (originSelectedOption) return originSelectedOption;

        return option;
      }

      default: {
        throw new Error("Mode tidak diketahui!");
      }
    }
  }) as MappedComboboxOption[];

  const isMultiple = mode === "single" ? false : true;

  const inputDisplayValue = (
    option?: MappedComboboxOption | MappedComboboxOption[],
  ) => {
    // option undefined
    if (!option) {
      return (combobox.selected! as MappedComboboxOption).label;
    }

    // Multiple Mode
    if (isModeMultiple(option)) {
      // Truncate String
      if (option.length > 3) {
        const firstThreeItems = option
          .slice(0, 3)
          .map((o) => o.label)
          .join(", ");
        return firstThreeItems + " ...";
      }

      return option.map((o) => o.label).join(", ");
    }

    // Single Mode
    return (option as MappedComboboxOption).label;
  };

  return {
    selected: combobox.selected,
    options: filteredOptions,
    isMultiple,
    dispatch,
    inputDisplayValue,
  };
}
