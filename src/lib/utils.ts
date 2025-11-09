import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // clsx builds the class string, twMerge resolves Tailwind conflicts
  return twMerge(clsx(...inputs));
}
