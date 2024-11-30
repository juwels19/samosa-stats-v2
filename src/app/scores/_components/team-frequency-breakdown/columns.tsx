"use client";

import { ColumnDef } from "@tanstack/react-table";

export const teamFrequencyBreakdownColumns: ColumnDef<{
  teamNumber: number;
  count: number;
}>[] = [
  {
    accessorKey: "teamNumber",
    header: "Team",
  },
  {
    accessorKey: "count",
    header: "Times picked",
    sortingFn: "basic",
    sortDescFirst: true,
    enableSorting: true,
  },
];
