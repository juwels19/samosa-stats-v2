import React from "react";
import TableLoading from "~/app/leaderboard/_components/table-loading";
import EventCardLoading from "~/components/common/event-card-loading";
import PageHeading from "~/components/common/page-heading";

const LeaderboardLoading = () => {
  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <PageHeading label="Overall leaderboard" />
      <TableLoading />

      <PageHeading label="Event specific results" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <EventCardLoading />
        <EventCardLoading />
        <EventCardLoading />
        <EventCardLoading />
      </div>
    </div>
  );
};

export default LeaderboardLoading;
