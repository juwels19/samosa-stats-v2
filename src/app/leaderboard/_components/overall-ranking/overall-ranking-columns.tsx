"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "~/lib/utils";

const renderMedals = (medalCounts: {
  gold: number;
  silver: number;
  bronze: number;
}) => {
  let medalString = "";
  if (medalCounts.gold > 0) {
    medalString += "🥇".repeat(medalCounts.gold);
  }
  if (medalCounts.silver > 0) {
    medalString += "🥈".repeat(medalCounts.silver);
  }
  if (medalCounts.bronze > 0) {
    medalString += "🥉".repeat(medalCounts.bronze);
  }
  return medalString;
};

export const overallRankingColumns: ColumnDef<{
  totalPoints: number;
  positiveBonusPoints: number;
  negativeBonusPoints: number;
  fullName: string;
  medalCounts: {
    gold: number;
    silver: number;
    bronze: number;
  };
}>[] = [
  {
    id: "rank",
    cell: ({ table, row }) => (
      <span className="font-bold text-lg">
        {table
          .getSortedRowModel()
          .flatRows.findIndex((flatRow) => flatRow.id === row.id) + 1}
      </span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <span className="flex flex-col font-bold text-lg">
        {row.original.fullName}
      </span>
    ),
  },
  {
    id: "medals",
    cell: ({ row }) => (
      <div className={cn("text-3xl flex flex-row gap-2 items-center")}>
        <span>{renderMedals(row.original.medalCounts)}</span>
      </div>
    ),
  },
  {
    id: "bonusPoints",
    header: "+/- points",
    cell: ({ row }) => (
      <span className="font-bold text-lg">
        {`${row.original.positiveBonusPoints} /
        ${row.original.negativeBonusPoints}`}
      </span>
    ),
  },
  {
    accessorKey: "totalPoints",
    header: "Total Points",
    sortingFn: "basic",
    sortDescFirst: true,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-bold text-lg">{row.original.totalPoints}</span>
    ),
  },
];
