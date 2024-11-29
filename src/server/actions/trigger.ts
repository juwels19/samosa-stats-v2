"use server";

import { Event } from "@prisma/client";
import { tasks } from "@trigger.dev/sdk/v3";
import type { closeEventSubmissionTask } from "~/trigger/close-event-submission";
import { EventWithPicks, setEventCountdownActive } from "~/db/queries/events";
import { revalidatePath } from "next/cache";
import { getEventCloseTime, getEventGateCloseTime } from "~/lib/utils";
import { closeEventTask } from "~/trigger/close-event";

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

export async function closeEvent({ event }: { event: Event | EventWithPicks }) {
  try {
    const handle = await tasks.trigger<typeof closeEventTask>(
      "close-event",
      { event },
      {
        delay: getEventCloseTime(event.startDate),
      }
    );

    revalidatePath("/settings");
    return { handle };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
