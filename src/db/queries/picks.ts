"use server";

import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import prisma from "~/db";

export async function getTeamPickCountsForEvent(eventId: number): Promise<{
  [key: number]: number;
}> {
  const picks = await prisma.pick.findMany({
    where: { Event: { id: eventId } },
  });

  const teamPickCount: { [key: number]: number } = {};

  picks.forEach((pick) => {
    const parsedPick = JSON.parse(pick.answersJSON);

    parsedPick.teams.forEach((teamNumber: number) => {
      if (teamPickCount[teamNumber]) {
        teamPickCount[teamNumber] += 1;
      } else {
        teamPickCount[teamNumber] = 1;
      }
    });
  });

  return teamPickCount;
}

export async function submitPickForEvent({
  eventId,
  userId,
  userFullname,
  teamNumbers,
  categoryIds,
  categories,
  displayName,
  isRandom,
}: {
  eventId: number;
  userId: string;
  userFullname: string;
  teamNumbers: string[];
  categoryIds: string[];
  categories: string[];
  displayName: string;
  isRandom: boolean;
}) {
  const timestamp = formatISO(new Date());
  try {
    const pick = await prisma.pick.upsert({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
      create: {
        createdAt: timestamp,
        answersJSON: JSON.stringify({
          teams: teamNumbers,
          categories: categories,
        }),
        userId: userId,
        userFullname,
        displayName,
        isRandom,
        Event: { connect: { id: eventId } },
        Categories: {
          connect: categoryIds.map((id: string) => ({
            id: parseInt(id),
          })),
        },
      },
      update: {
        answersJSON: JSON.stringify({
          teams: teamNumbers,
          categories: categories,
        }),
        userFullname,
        displayName,
        isRandom,
        Categories: {
          set: [],
          connect: categoryIds.map((id: string) => ({
            id: parseInt(id),
          })),
        },
      },
    });

    return { success: true, data: { pick: JSON.stringify(pick) } };
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(e.message);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pickWithCategories = Prisma.validator<Prisma.PickDefaultArgs>()({
  include: {
    Categories: true,
  },
});

export type PickWithCategories = Prisma.PickGetPayload<
  typeof pickWithCategories
>;

export async function setPickScoresForEvent(picksWithScores: {
  [key: string]: number;
}) {
  await prisma.$transaction(
    Object.entries(picksWithScores).map(([pickId, score]) =>
      prisma.pick.update({
        where: {
          id: parseInt(pickId),
        },
        data: { score: score },
      })
    )
  );
  return { success: true, data: {} };
}
