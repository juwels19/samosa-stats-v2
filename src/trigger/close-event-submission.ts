import { Event } from "@prisma/client";
import { logger, task } from "@trigger.dev/sdk/v3";
import { EventWithPicks } from "~/db/queries/events";
import { sendEventSubmissionsClosedMessage } from "~/server/http/discord";
import prisma from "~/db";

export type CloseEventSubmissionPayload = {
  event: Event | EventWithPicks;
};

export const closeEventSubmissionTask = task({
  id: "close-event-submission",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 120, // Stop executing after 120 secs (2 mins) of compute
  queue: {
    concurrencyLimit: 1,
  },
  run: async (payload: CloseEventSubmissionPayload, { ctx }) => {
    logger.log(
      `Closing event submissions for event with code: ${payload.event.eventCode}`,
      { payload, ctx }
    );

    logger.log("Calling prisma to turn event submissions off...");
    await prisma.event.update({
      where: { eventCode: payload.event.eventCode },
      data: { isCountdownActive: false, isSubmissionClosed: true },
    });

    logger.log("Sending Discord message...", { payload, ctx });
    sendEventSubmissionsClosedMessage({
      eventName: payload.event.displayName ?? payload.event.name,
    });

    logger.log(
      `Submissions successfully closed for event with code: ${payload.event.eventCode}`
    );
    return {
      message: `Submissions successfully closed for event with code: ${payload.event.eventCode}`,
    };
  },
});
