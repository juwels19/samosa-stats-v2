import { Event } from "@prisma/client";
import { logger, task } from "@trigger.dev/sdk/v3";
import { EventWithPicks } from "~/db/queries/events";
import { sendEventSubmissionsClosedMessage } from "~/server/http/discord";
import prisma from "~/db";

export type CloseEventPayload = {
  event: Event | EventWithPicks;
};

export const closeEventTask = task({
  id: "close-event",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 120, // Stop executing after 120 secs (2 mins) of compute
  queue: {
    concurrencyLimit: 1,
  },
  run: async (payload: CloseEventPayload, { ctx }) => {
    logger.log(
      `Closing event for event with code: ${payload.event.eventCode}`,
      { payload, ctx }
    );

    logger.log("Calling prisma to turn event off...");
    await prisma.event.update({
      where: { eventCode: payload.event.eventCode },
      data: { isComplete: true, isOngoing: false },
    });

    logger.log("Sending Discord message...", { payload, ctx });
    sendEventSubmissionsClosedMessage({
      eventName: payload.event.displayName ?? payload.event.name,
    });

    logger.log(
      `Event with code: ${payload.event.eventCode} has successfully closed`
    );
    return {
      message: `Event with code: ${payload.event.eventCode} has successfully closed`,
    };
  },
});
