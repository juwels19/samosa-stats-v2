/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category } from "@prisma/client";
import { createContext } from "react";
import { EventWithPicks } from "~/db/queries/events";
import { FrcEvents_Teams } from "~/server/http/frc-events";

type PickContextType = {
  teamSelections: { [key: string]: boolean };
  setTeamSelections: (value: { [key: string]: boolean }) => void;
  categorySelections: { [key: string]: boolean };
  setCategorySelections: (value: { [key: string]: boolean }) => void;
  categories: Category[];
  event: EventWithPicks;
};

export const PickContext = createContext({} as PickContextType);
