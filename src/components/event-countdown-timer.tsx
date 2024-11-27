"use client";

import { TZDate } from "@date-fns/tz";
import { Event } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import React, { useEffect } from "react";
import { EventWithPicks } from "~/db/queries/events";
import { cn, getEventGateCloseTime } from "~/lib/utils";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";

const EventCountdownTimer = ({ event }: { event: Event | EventWithPicks }) => {
  const secondsDifference = differenceInSeconds(
    getEventGateCloseTime(event.startDate),
    new TZDate(),
    {
      roundingMethod: "floor",
    }
  );
  const [secondsRemaining, setSecondsRemaining] =
    React.useState(secondsDifference);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1);
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  // Convert seconds to hours, minutes, and seconds
  const daysRemaining = Math.floor(secondsRemaining / 86400);
  const hoursRemaining = Math.floor((secondsRemaining % 86400) / 3600);
  const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);

  return (
    <NumberFlowGroup>
      <div
        className={cn(
          "w-full flex flex-row justify-end gap-2",
          daysRemaining <= 2 ? "text-red-500" : ""
        )}
      >
        <NumberFlow value={daysRemaining} trend={-1} suffix="d" />
        <NumberFlow value={hoursRemaining} trend={-1} suffix="h" />
        <NumberFlow value={minutesRemaining} trend={-1} suffix="m" />
        <NumberFlow value={secondsRemaining % 60} trend={-1} suffix="s" />
      </div>
    </NumberFlowGroup>
  );
};

export default EventCountdownTimer;
