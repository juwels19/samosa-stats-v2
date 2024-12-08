"use client";

import { Pick } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "~/lib/utils";

const renderMedal = (rank: number, index: number, rowCount: number) => {
  if (rank === 1) return `🥇`;
  if (rank === 2) return `🥈`;
  if (rank === 3) return `🥉`;
  if (index === rowCount) return `🧻`;
  return null;
};

const renderBonusPoint = (
  isRandom: boolean,
  rank: number,
  rowCount: number
) => {
  // Change this to look at the rank instead of the index
  if (isRandom && rank <= 3)
    return <span className="text-green-500 font-semibold text-xl">+1</span>;
  if (isRandom && rank >= rowCount - 3)
    return <span className="text-red-500 font-semibold text-xl">-1</span>;
  return null;
};

export const rankingColumns: ColumnDef<Pick>[] = [
  {
    id: "rank",
    cell: ({ row }) => (
      <span className="font-bold text-lg">{row.index + 1}</span>
    ),
  },
  {
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col font-bold md:text-lg">
        {row.original.displayName && <span>{row.original.displayName}</span>}
        <span
          className={cn(
            row.original.displayName ? "text-sm text-neutral-500" : ""
          )}
        >
          {row.original.userFullname}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <div className="flex flex-row">
        <span className="font-bold text-lg w-10">{row.original.score}</span>
        <span className="text-xl">{row.original.isRandom ? "🎲" : ""}</span>
      </div>
    ),
  },
  {
    id: "medals",
    cell: ({ table, row }) => (
      <div className={cn("text-3xl flex flex-row gap-2 items-center")}>
        <span>
          {renderMedal(
            row.original.rank || row.index + 1,
            row.index + 1,
            table.getRowCount()
          )}
        </span>
        {renderBonusPoint(
          row.original.isRandom,
          row.original.rank || row.index + 1,
          table.getRowCount()
        )}
      </div>
    ),
  },
];
