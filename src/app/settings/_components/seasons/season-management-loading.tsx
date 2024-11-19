import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const SeasonManagementLoading = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">Season</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-[52px] w-full" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-1/4" />
      </CardContent>
    </Card>
  );
};

export default SeasonManagementLoading;
