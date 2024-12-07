import React from "react";
import PageHeading from "~/components/common/page-heading";
import { Skeleton } from "~/components/ui/skeleton";
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
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
};

export default EventSpecificResultsLoading;
