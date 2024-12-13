import React from "react";
import TableLoading from "~/app/leaderboard/_components/table-loading";
import PageHeading from "~/components/common/page-heading";
import { ROUTES } from "~/lib/routes";

const EventSpecificResultsLoading = () => {
  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <PageHeading
          label=""
          hasBackButton
          backButtonHref={ROUTES.LEADERBOARD}
        />

        <TableLoading />
      </div>
    </div>
  );
};

export default EventSpecificResultsLoading;
