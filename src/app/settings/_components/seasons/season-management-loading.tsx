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
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  );
};

export default SeasonManagementLoading;
