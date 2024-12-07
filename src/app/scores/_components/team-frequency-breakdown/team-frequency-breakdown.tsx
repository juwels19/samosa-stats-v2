"use client";

import React from "react";
import { teamFrequencyBreakdownColumns } from "~/app/scores/_components/team-frequency-breakdown/columns";
import { DataTable } from "~/components/ui/data-table";
import { H3 } from "~/components/ui/typography";

const TeamFrequencyBreakdown = ({
  data,
}: {
  data: { [key: number]: number };
}) => {
  const mappedData = Object.entries(data).map(([teamNumber, count]) => ({
    teamNumber: parseInt(teamNumber),
    count,
  }));

  return (
    <div className="flex flex-col gap-4">
      <H3>Team frequency</H3>
      <div className="mb-6">
        <DataTable
          columns={teamFrequencyBreakdownColumns}
          data={mappedData}
          initialSorting={{ id: "count", desc: true }}
          containerClassName="border-none"
        />
      </div>
    </div>
  );
};

export default TeamFrequencyBreakdown;
