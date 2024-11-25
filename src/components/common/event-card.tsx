"use client";

import { parseJSON } from "date-fns";
import { BellRingIcon, CheckIcon, MoveRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import EditEventForm from "~/app/settings/_components/events/edit-event-form";
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
  const bellIconVariants = {
    default: { rotate: 0 },
    hover: { rotate: [0, -10, 10, -10, 0] },
  };

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
          {event.displayName ?? event.name}
        </CardTitle>
        <CardDescription>
          <span className="font-semibold">{event.eventCode}</span>
          <br />
          {parseJSON(event.startDate).toDateString()} -{" "}
          {parseJSON(event.endDate).toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 ">
          <div className="flex flex-row gap-2">
            <span className="font-semibold">Teams to pick:</span>
            <span>{event.numberOfTeamPicks}</span>
          </div>
          <div className="flex flex-row gap-2">
            <span className="font-semibold">Categories to pick:</span>
            <span>{event.numberOfCategoryPicks}</span>
          </div>
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
              <Button asChild size="sm" variant="link">
                <motion.button
                  type="button"
                  initial="default"
                  whileHover="hover"
                >
                  <motion.div variants={bellIconVariants}>
                    <BellRingIcon className="!size-4" />
                  </motion.div>
                  Notify
                </motion.button>
              </Button>
              <EditEventForm event={event} />
            </>
          ) : (
            <>
              {eventHasPicks && (
                <p className="inline-flex items-center gap-1">
                  Pick submitted <CheckIcon color="green" />
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
