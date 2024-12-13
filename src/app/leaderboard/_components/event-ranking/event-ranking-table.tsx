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
        initialSorting={{ id: "score", desc: true }}
      />
      <p className="text-md">
        <span className="font-semibold mr-1">NOTE:</span>Ties are broken by a
        measure of team uniqueness. The uniqueness is calculated by summing the
        frequency of the individual teams you picked. A lower uniqueness score
        means you picked more unique teams.
      </p>
    </div>
  );
};

export default RankingTable;
