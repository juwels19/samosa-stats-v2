"use client";
import { Category, Event } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { EventWithPicks } from "~/db/queries/events";
import { submitPickForEvent } from "~/db/queries/picks";
import { env } from "~/lib/env";
import { getRandomInt } from "~/lib/utils";
import { fetchTeamsForEvent } from "~/server/http/frc-events";

const GenerateRandomPick = ({
  event,
  categories,
}: {
  event: Event | EventWithPicks;
  categories: Category[];
}) => {
  const teamFetcher = useQuery({
    queryKey: ["teams", event.eventCode],
    queryFn: async () => {
      const teams = await fetchTeamsForEvent(event.eventCode);
      return teams;
    },
  });

  const onClick = async () => {
    const teams = teamFetcher.data;

    if (!teams) {
      toast.error("There was an error generating random picks.");
      return;
    }

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
    const randomKey = Math.floor(Math.random() * 10);
    await submitPickForEvent({
      categories: categories
        .filter((category) =>
          randomCategoryIds.includes(category.id.toString())
        )
        .map((category) => category.text),
      categoryIds: randomCategoryIds,
      teamNumbers: randomTeamNumbers,
      displayName: `Auto-generated picks for ${event.eventCode} - ${randomKey}`,
      isRandom: false,
      userId: `ADMIN-${randomKey}`,
      userFullname: `ADMIN-${randomKey}`,
      eventId: event.id,
    });
    toast.success("Random picks generated successfully!");
  };

  if (env.NODE_ENV !== "development") return null;

  return (
    <Button variant="secondary" onClick={onClick}>
      Generate Random Pick
    </Button>
  );
};

export default GenerateRandomPick;
