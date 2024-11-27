import { TZDate } from "@date-fns/tz";
import { clsx, type ClassValue } from "clsx";
import { addHours, startOfDay, addDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEventGateCloseTime(startDate: string) {
  return new TZDate(
    addHours(startOfDay(addDays(startDate, 1)), 9),
    "America/Toronto"
  ).toISOString();
}
