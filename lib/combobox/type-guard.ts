import { MappedComboboxOption } from "@/components/combobox/use-combobox";

export function isModeMultiple(value: unknown): value is MappedComboboxOption[] {
  // Single Mode
  if (typeof value !== 'undefined' && !Array.isArray(value)) return false;

  // Multiple Mode
  return true;
}