import React from "react";
import { overallRankingColumns } from "~/app/leaderboard/_components/overall-ranking/overall-ranking-columns";
import { DataTable } from "~/components/ui/data-table";

const OverallRankingTable = ({
  rankingData,
}: {
  rankingData: {
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
  }[];
}) => {
  return (
    <div className="flex flex-col w-full max-w-5xl gap-4 mx-auto">
      <DataTable
        columns={overallRankingColumns}
        data={rankingData}
        containerClassName="border-none"
        initialSorting={{ id: "totalPoints", desc: true }}
      />
    </div>
  );
};

export default OverallRankingTable;
