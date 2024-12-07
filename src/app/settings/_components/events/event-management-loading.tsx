import React from "react";
import EventCardLoading from "~/components/common/event-card-loading";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

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
