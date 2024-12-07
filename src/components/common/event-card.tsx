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
  type,
}: {
  event: EventWithPicks;
  type?: "admin" | "scoring" | "leaderboard" | undefined;
}) => {
  const eventHasPicks = (event.Pick && event?.Pick?.length !== 0) || false;

  const isAdminCard = type === "admin";
  const isScoringCard = type === "scoring";
  const isLeaderboardCard = type === "leaderboard";

  const userHasRandomPick =
    event?.Pick &&
    event.Pick.length > 0 &&
    event.Pick.find((pick) => pick.isRandom) !== undefined;

  const renderNavigationLink = () => {
    let linkText = "Submit Picks";
    let route = ROUTES.PICKS;

    if (isScoringCard) {
      linkText = "Submit Scores";
      route = ROUTES.SCORES;
    } else if (isLeaderboardCard) {
      linkText = "View Results";
      route = ROUTES.LEADERBOARD;
    } else if (event.isOngoing && !eventHasPicks && !userHasRandomPick) {
      linkText = "Submit Random Picks";
    } else if (event.isComplete || (event.isOngoing && eventHasPicks)) {
      linkText = "View Picks";
    }

    return (
      <Link href={`${route}/${event.eventCode}`}>
        <Button variant="link" className="pr-0">
          {linkText}
          <MoveRightIcon />
        </Button>
      </Link>
    );
  };

  return (
    <Card
      className={cn(
        "flex flex-col",
        eventHasPicks && !isScoringCard && !isLeaderboardCard
          ? "bg-green-200/20 dark:bg-green-950/50"
          : ""
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
          {event.isCountdownActive && !event.isComplete && !event.isOngoing && (
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
            isAdminCard ||
              (eventHasPicks && !isScoringCard && !isLeaderboardCard)
              ? "justify-between"
              : "justify-end"
          )}
        >
          {isAdminCard ? (
            <>
              <NotificationButton event={event} />
              <EditEventForm event={event} />
            </>
          ) : (
            <>
              {eventHasPicks && !isScoringCard && !isLeaderboardCard && (
                <p className="inline-flex items-center gap-1">
                  <CheckIcon color="green" />
                  {userHasRandomPick
                    ? "Random pick submitted"
                    : "Pick submitted"}
                </p>
              )}
              {renderNavigationLink()}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
