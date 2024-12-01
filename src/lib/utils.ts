import { TZDate } from "@date-fns/tz";

import { clsx, type ClassValue } from "clsx";
import { addHours, startOfDay, addDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEventGateCloseTime(startDate: string) {
  return new TZDate(
    addHours(startOfDay(addDays(new Date(startDate), 1)), 9),
    "America/Toronto"
  ).toISOString();
}

export function getEventCloseTime(startDate: string) {
  return new TZDate(
    addHours(startOfDay(addDays(new Date(startDate), 2)), 12),
    "America/Toronto"
  ).toISOString();
}

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};
