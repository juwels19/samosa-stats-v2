"use server";

import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import { revalidatePath } from "next/cache";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const picksForOverallLeaderboard = Prisma.validator<Prisma.PickDefaultArgs>()({
  include: { Event: { select: { eventCode: true } } },
});

export type PicksForOverallLeaderboard = Prisma.PickGetPayload<
  typeof picksForOverallLeaderboard
>;

export async function getPicksForOverallLeaderboard() {
  const picks = await prisma.pick.findMany({
    where: {
      Event: {
        Season: { isActive: true },
        // name: { notIn: ["science", "technology"] },
      },
      rank: { not: null },
    },
    include: { Event: { select: { eventCode: true } } },
  });
  return picks;
}

export async function getNumberOfRankingCountsPerUser() {
  const finalCounts: { [key: string]: { [key: number]: number } } = {};
  const picks = await prisma.pick.groupBy({
    by: ["userId", "rank"],
    where: {
      Event: {
        Season: { isActive: true },
      },
      rank: { not: null },
    },
    _count: true,
  });

  picks.map((pick) => {
    if (finalCounts[pick.userId]) {
      finalCounts[pick.userId][pick.rank || -10] = pick._count;
    } else {
      finalCounts[pick.userId] = { [pick!.rank || -10]: pick._count };
    }
  });

  return finalCounts;
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

export async function setPickScoresForEvent(
  picksWithScores: { pickId: string; score: number; rank: number }[],
  eventCode: string
) {
  await prisma.$transaction(
    picksWithScores.map((data) =>
      prisma.pick.update({
        where: {
          id: parseInt(data.pickId),
        },
        data: { score: data.score, rank: data.rank },
      })
    )
  );
  revalidatePath(`/scores/${eventCode}`);
  return { success: true, data: {} };
}
