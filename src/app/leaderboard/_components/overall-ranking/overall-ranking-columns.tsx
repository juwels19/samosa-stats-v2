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
  rankCount: {
    [key: number]: number;
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
    sortingFn: (rowA, rowB) => {
      if (rowA.original.totalPoints !== rowB.original.totalPoints)
        return rowA.original.totalPoints - rowB.original.totalPoints;
      // At this point, the two rows are equal in terms of total points

      // First tiebreaker: gold medals
      if (rowA.original.medalCounts.gold !== rowB.original.medalCounts.gold)
        return rowA.original.medalCounts.gold - rowB.original.medalCounts.gold;
      // Second tiebreaker: silver medals
      if (rowA.original.medalCounts.silver !== rowB.original.medalCounts.silver)
        return (
          rowA.original.medalCounts.silver - rowB.original.medalCounts.silver
        );
      // Third tiebreaker: bronze medals
      if (rowA.original.medalCounts.bronze !== rowB.original.medalCounts.bronze)
        return (
          rowA.original.medalCounts.bronze - rowB.original.medalCounts.bronze
        );
      // Fourth tiebreaker: least number of times coming in last
      if (rowA.original.rankCount[-1] && !rowB.original.rankCount[-1])
        return -1;
      else if (!rowA.original.rankCount[-1] && rowB.original.rankCount[-1])
        return 1;
      else if (rowA.original.rankCount[-1] && rowB.original.rankCount[-1])
        return -1 * (rowA.original.rankCount[-1] - rowB.original.rankCount[-1]);

      // Fifth tiebreaker: least number of times coming in 4th
      if (rowA.original.rankCount[4] && !rowB.original.rankCount[4]) return 1;
      else if (!rowA.original.rankCount[4] && rowB.original.rankCount[4])
        return -1;
      else if (rowA.original.rankCount[4] && rowB.original.rankCount[4])
        return rowA.original.rankCount[4] - rowB.original.rankCount[4];

      // Sixth tiebreaker: least number of times coming in 5th
      if (rowA.original.rankCount[5] && !rowB.original.rankCount[5]) return 1;
      else if (!rowA.original.rankCount[5] && rowB.original.rankCount[5])
        return -1;
      else if (rowA.original.rankCount[5] && rowB.original.rankCount[5])
        return rowA.original.rankCount[5] - rowB.original.rankCount[5];

      // Seventh tiebreaker: least number of times coming in 6th
      if (rowA.original.rankCount[6] && !rowB.original.rankCount[6]) return 1;
      else if (!rowA.original.rankCount[6] && rowB.original.rankCount[6])
        return -1;
      else if (rowA.original.rankCount[6] && rowB.original.rankCount[6])
        return rowA.original.rankCount[6] - rowB.original.rankCount[6];

      // Eighth tiebreaker: least number of times coming in 7th
      if (rowA.original.rankCount[7] && !rowB.original.rankCount[7]) return 1;
      else if (!rowA.original.rankCount[7] && rowB.original.rankCount[7])
        return -1;
      else if (rowA.original.rankCount[7] && rowB.original.rankCount[7])
        return rowA.original.rankCount[7] - rowB.original.rankCount[7];

      // Ninth tiebreaker: least number of times coming in 8th
      if (rowA.original.rankCount[8] && !rowB.original.rankCount[8]) return 1;
      else if (!rowA.original.rankCount[8] && rowB.original.rankCount[8])
        return -1;
      else if (rowA.original.rankCount[8] && rowB.original.rankCount[8])
        return rowA.original.rankCount[8] - rowB.original.rankCount[8];

      return 1;
    },
    sortDescFirst: true,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-bold text-lg">{row.original.totalPoints}</span>
    ),
  },
];
