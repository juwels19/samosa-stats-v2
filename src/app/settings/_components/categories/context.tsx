/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category } from "@prisma/client";
import { createContext } from "react";

type CategoryContextType = {
  initialCategories: Category[];
  edits: Category[];
  hasEdits: boolean;
  setHasEdits: (value: boolean) => void;
  activeSeasonId: number;
  setActiveSeasonId: (value: number) => void;
};

export const CategoryContext = createContext({
  initialCategories: [] as Category[],
  edits: [] as Category[],
  hasEdits: false,
  setHasEdits: (value: boolean) => {},
  activeSeasonId: 0,
  setActiveSeasonId: (value: number) => {},
} as CategoryContextType);
