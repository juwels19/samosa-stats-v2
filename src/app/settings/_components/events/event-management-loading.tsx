import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const EventCardLoading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-3 w-40" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-row justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
};

const EventManagementLoading = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-4">
          Events
          <Skeleton className="h-9 w-28" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventCardLoading />
          <EventCardLoading />
          <EventCardLoading />
          <EventCardLoading />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManagementLoading;
