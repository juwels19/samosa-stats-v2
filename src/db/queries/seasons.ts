"use server";
import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import prisma from "~/db";

export async function getAllSeasons() {
  const seasons = await prisma.season.findMany();
  return seasons;
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
