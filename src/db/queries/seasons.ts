"use server";
import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import prisma from "~/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const activeSeasonWithEvents = Prisma.validator<Prisma.SeasonDefaultArgs>()({
  include: { Event: true },
});

export type ActiveSeasonWithEvents = Prisma.SeasonGetPayload<
  typeof activeSeasonWithEvents
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const activeSeasonWithEventsAndPicks =
  Prisma.validator<Prisma.SeasonDefaultArgs>()({
    include: {
      Event: { include: { Pick: { include: { Categories: true } } } },
    },
  });

export type ActiveSeasonWithEventsAndPicks = Prisma.SeasonGetPayload<
  typeof activeSeasonWithEventsAndPicks
>;

export async function getAllSeasons() {
  const seasons = await prisma.season.findMany();
  return seasons;
}

export async function getActiveSeason() {
  const season = await prisma.season.findFirst({
    where: { isActive: true },
    include: {
      Event: { include: { Pick: { include: { Categories: true } } } },
    },
  });
  return season;
}

export async function createSeason({
  year,
  gameName,
}: {
  year: number;
  gameName: string;
}) {
  const timestamp = formatISO(new Date());
  try {
    const [, newSeason] = await prisma.$transaction([
      prisma.season.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      }),
      prisma.season.create({
        data: {
          createdAt: timestamp,
          year,
          gameName,
          isActive: true,
        },
      }),
    ]);

    return { success: true, data: { newSeason } };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        throw new Error("Season with this year already exists.");
      }
    }
  }
}
