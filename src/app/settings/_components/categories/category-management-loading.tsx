import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const CategoryManagementLoading = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between gap-4">Categories</CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-56 w-full mt-2" />
        <Skeleton className="h-9 w-1/4" />
      </CardContent>
    </Card>
  );
};

export default CategoryManagementLoading;
