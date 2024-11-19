/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category } from "@prisma/client";
import { createContext } from "react";

export const CategoryContext = createContext({
  initialCategories: [] as Category[],
  edits: [] as Category[],
  hasEdits: false,
  setHasEdits: (value: boolean) => {},
});
