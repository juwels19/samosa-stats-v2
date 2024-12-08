import React from "react";
import { rankingColumns } from "~/app/leaderboard/_components/event-ranking/event-ranking-columns";
import { DataTable } from "~/components/ui/data-table";
import { EventWithPicks } from "~/db/queries/events";

const RankingTable = ({ event }: { event: EventWithPicks }) => {
  const picks = event.Pick;

  return (
    <div className="flex flex-col w-full max-w-5xl gap-4 mx-auto">
      <DataTable
        columns={rankingColumns}
        data={picks}
        containerClassName="border-none"
      />
    </div>
  );
};

export default RankingTable;
