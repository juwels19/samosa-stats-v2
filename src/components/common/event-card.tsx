"use client";

import { parseJSON } from "date-fns";
import { CheckIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import EditEventForm from "~/app/settings/_components/events/edit-event-form";
import NotificationButton from "~/app/settings/_components/events/notification-button";
import EventCountdownTimer from "~/components/event-countdown-timer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { EventWithPicks } from "~/db/queries/events";
import { ROUTES } from "~/lib/routes";
import { cn } from "~/lib/utils";

const EventCard = ({
  event,
  isAdminCard = false,
}: {
  event: EventWithPicks;
  isAdminCard?: boolean;
}) => {
  const eventHasPicks = (event.Pick && event?.Pick?.length !== 0) || false;

  return (
    <Card
      className={cn(
        "flex flex-col",
        eventHasPicks ? "bg-green-200/20 dark:bg-green-950/50" : ""
      )}
    >
      <CardHeader className="grow">
        {/* overflow-hidden text-ellipsis whitespace-nowrap */}
        <CardTitle className="text-balance">
          {event.displayName || event.name}
        </CardTitle>
        <CardDescription>
          <span className="font-semibold">{event.eventCode}</span>
          <br />
          {parseJSON(event.startDate).toDateString()} -{" "}
          {parseJSON(event.endDate).toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex flex-row gap-2">
              <span className="font-semibold">Teams:</span>
              <span>{event.numberOfTeamPicks}</span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="font-semibold">Categories:</span>
              <span>{event.numberOfCategoryPicks}</span>
            </div>
          </div>
          {event.isCountdownActive && (
            <div className="flex flex-col items-end">
              <span className="font-semibold">Time to gate close:</span>
              <EventCountdownTimer event={event} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div
          className={cn(
            "w-full flex flex-row justify-between",
            isAdminCard || eventHasPicks ? "justify-between" : "justify-end"
          )}
        >
          {isAdminCard ? (
            <>
              <NotificationButton event={event} />
              <EditEventForm event={event} />
            </>
          ) : (
            <>
              {eventHasPicks && (
                <p className="inline-flex items-center gap-1">
                  <CheckIcon color="green" />
                  Pick submitted
                </p>
              )}
              <Link href={`${ROUTES.PICKS}/${event.eventCode}`}>
                <Button variant="link">
                  {!event.isSubmissionClosed ? "Submit Picks" : "View Picks"}
                  <MoveRightIcon />
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
