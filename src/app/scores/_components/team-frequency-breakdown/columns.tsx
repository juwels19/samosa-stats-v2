"use client";

import { ColumnDef } from "@tanstack/react-table";

export const teamFrequencyBreakdownColumns: ColumnDef<{
  teamNumber: number;
  count: number;
}>[] = [
  {
    accessorKey: "teamNumber",
    header: "Team",
    cell: ({ row }) => (
      <span className="flex flex-col font-bold text-lg">
        {row.original.teamNumber}
      </span>
    ),
  },
  {
    accessorKey: "count",
    header: "Times picked",
    sortingFn: "basic",
    sortDescFirst: true,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-bold text-lg">{row.original.count}</span>
    ),
  },
];
