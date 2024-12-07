import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import React from "react";
import { rankingColumns } from "~/app/leaderboard/_components/event-ranking/event-ranking-columns";
import { DataTable } from "~/components/ui/data-table";
import { EventWithPicks } from "~/db/queries/events";

const RankingTable = ({
  event,
  shouldShowLegend = false,
}: {
  event: EventWithPicks;
  shouldShowLegend?: boolean;
}) => {
  const picks = event.Pick;

  return (
    <div className="flex flex-col w-full max-w-5xl gap-4 mx-auto">
      <DataTable
        columns={rankingColumns}
        data={picks}
        containerClassName="border-none"
      />
      {shouldShowLegend && (
        <div className="flex flex-col">
          <div className="flex flex-row gap-3 items-start">
            <span className="text-xl">🎲</span>
            <span>= a randomized pick</span>
          </div>
          <div className="flex flex-row gap-1 items-start">
            <div className="shrink-0">
              <TrendingUpIcon className="text-green-500 size-7" />
            </div>
            <span>
              = +1 bonus point in overall leaderboard for a random pick in the
              top 3
            </span>
          </div>
          <div className="flex flex-row gap-1 items-start">
            <div className="shrink-0">
              <TrendingDownIcon className="text-red-500 size-7" />
            </div>
            <span>
              = -1 bonus point in overall leaderboard for a random pick in the
              bottom 3
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingTable;
