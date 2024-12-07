import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import React from "react";
import { overallRankingColumns } from "~/app/leaderboard/_components/overall-ranking/overall-ranking-columns";
import { DataTable } from "~/components/ui/data-table";

const OverallRankingTable = ({
  shouldShowLegend = false,
}: {
  shouldShowLegend?: boolean;
}) => {
  return (
    <div className="flex flex-col w-full max-w-5xl gap-4 mx-auto">
      {/* <DataTable
        columns={overallRankingColumns}
        data={picks}
        containerClassName="border-none"
      /> */}
      {shouldShowLegend && (
        <div className="flex flex-col">
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

export default OverallRankingTable;
