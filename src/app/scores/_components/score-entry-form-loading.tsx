import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

const ScoreEntryFormLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48 md:w-72 lg:w-96 mt-2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </div>
  );
};

export default ScoreEntryFormLoading;
