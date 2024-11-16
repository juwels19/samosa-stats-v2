"use server";
import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import prisma from "~/db";

export async function getAllEvents() {}

export async function createEvent({
  eventData,
}: {
  eventData: {
    seasonId: number;
    seasonYear: number;
    eventCode: string;
    eventName: string;
    startDate: string;
    endDate: string;
    numTeamPicks: number;
    numCategoryPicks: number;
  };
}) {
  const timestamp = formatISO(new Date());
  try {
    const newEvent = await prisma.event.create({
      data: {
        Season: { connect: { id: eventData.seasonId } },
        name: eventData.eventName,
        eventCode: `${eventData.seasonYear}${eventData.eventCode}`,
        numberOfTeamPicks: eventData.numTeamPicks,
        numberOfCategoryPicks: eventData.numCategoryPicks,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        createdAt: timestamp,
      },
    });

    return { success: true, data: { newEvent } };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        throw new Error("Event already exists.");
      }
    }
  }
}
