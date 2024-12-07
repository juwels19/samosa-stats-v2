"use client";

import { Pick } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
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
  index: number,
  rowCount: number
) => {
  if (isRandom && index <= 3)
    return <TrendingUpIcon className="text-green-500 size-7" />;
  if (isRandom && index >= rowCount - 3)
    return <TrendingDownIcon className="text-red-500 size-7" />;
  return null;
};

export const overallRankingColumns: ColumnDef<Pick>[] = [
  {
    id: "rank",
    cell: ({ row }) => (
      <span className="font-bold text-lg">{row.index + 1}</span>
    ),
  },
  {
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col font-bold text-lg">
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
          row.index + 1,
          table.getRowCount()
        )}
      </div>
    ),
  },
  {
    id: "points",
    header: "Points",
    cell: ({ row }) => <span>test points</span>,
  },
];
