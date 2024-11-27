"use server";

import { Event } from "@prisma/client";
import { tasks } from "@trigger.dev/sdk/v3";
import type { closeEventSubmissionTask } from "~/trigger/close-event-submission";
import { EventWithPicks, setEventCountdownActive } from "~/db/queries/events";
import { revalidatePath } from "next/cache";
import { getEventGateCloseTime } from "~/lib/utils";

export async function closeEventSubmission({
  event,
}: {
  event: Event | EventWithPicks;
}) {
  try {
    await setEventCountdownActive({ eventId: event.id });

    const handle = await tasks.trigger<typeof closeEventSubmissionTask>(
      "close-event-submission",
      { event },
      {
        delay: getEventGateCloseTime(event.startDate),
      }
    );

    revalidatePath("/settings");
    return { handle };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
