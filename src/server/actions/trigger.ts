"use server";

import { Event } from "@prisma/client";
import { tasks } from "@trigger.dev/sdk/v3";
import type { closeEventSubmissionTask } from "~/trigger/close-event-submission";
import { EventWithPicks, setEventCountdownActive } from "~/db/queries/events";
import { revalidatePath } from "next/cache";
import {
  getEventCloseTime,
  getEventGateCloseTime,
  getRandomInt,
} from "~/lib/utils";
import { closeEventTask } from "~/trigger/close-event";
import { fetchTeamsForEvent } from "~/server/http/frc-events";
import { getCategoriesForActiveSeason } from "~/db/queries/categories";
import { submitPickForEvent } from "~/db/queries/picks";

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

    const teams = await fetchTeamsForEvent(event.eventCode);
    const categories = await getCategoriesForActiveSeason();

    const randomTeamsObj: { [key: string]: boolean } = {};

    for (let i = 0; i < event.numberOfTeamPicks; i++) {
      let randomInt = getRandomInt(0, teams.length - 1);

      if (!randomTeamsObj[teams[randomInt].teamNumber]) {
        randomTeamsObj[teams[randomInt].teamNumber] = true;
        continue;
      }
      // If we're here, then we've already picked this team
      while (randomTeamsObj[teams[randomInt].teamNumber]) {
        randomInt = getRandomInt(0, teams.length - 1);
      }
      randomTeamsObj[teams[randomInt].teamNumber] = true;
    }

    const randomTeamNumbers = Object.keys(randomTeamsObj).sort();

    const randomCategoriesObj: { [key: string]: boolean } = {};

    for (let i = 0; i < event.numberOfCategoryPicks; i++) {
      let randomInt = getRandomInt(0, categories.length - 1);

      if (!randomCategoriesObj[categories[randomInt].id]) {
        randomCategoriesObj[categories[randomInt].id] = true;
        continue;
      }
      // If we're here, then we've already picked this team
      while (randomCategoriesObj[categories[randomInt].id]) {
        randomInt = getRandomInt(0, categories.length - 1);
      }
      randomCategoriesObj[categories[randomInt].id] = true;
    }

    const randomCategoryIds = Object.keys(randomCategoriesObj).sort();

    await submitPickForEvent({
      categories: categories
        .filter((category) =>
          randomCategoryIds.includes(category.id.toString())
        )
        .map((category) => category.text),
      categoryIds: randomCategoryIds,
      teamNumbers: randomTeamNumbers,
      displayName: `Auto-generated picks for ${event.eventCode}`,
      isRandom: true,
      userId: "ADMIN",
      userFullname: "ADMIN",
      eventId: event.id,
    });

    revalidatePath("/settings");
    return { handle };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}
