import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

const TableLoading = () => {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      <div className="border-b">
        <Skeleton className="h-5 m-4" />
      </div>
      <div className="border-b">
        <Skeleton className="h-5 m-4" />
      </div>
      <div className="border-b">
        <Skeleton className="h-5 m-4" />
      </div>
      <div className="border-b">
        <Skeleton className="h-5 m-4" />
      </div>
    </div>
  );
};

export default TableLoading;
