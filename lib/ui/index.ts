import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Digunakan untuk bekerja dengan component shadcn ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}