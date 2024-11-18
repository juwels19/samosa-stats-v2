"use server";
import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import { revalidatePath } from "next/cache";
import prisma from "~/db";

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

    revalidatePath("/settings");
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

export async function updateEvent({
  eventData,
}: {
  eventData: {
    eventCode: string;
    numTeamPicks: number;
    numCategoryPicks: number;
  };
}) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { eventCode: eventData.eventCode },
      data: {
        numberOfTeamPicks: eventData.numTeamPicks,
        numberOfCategoryPicks: eventData.numCategoryPicks,
      },
    });

    revalidatePath("/settings");
    return { success: true, data: { updatedEvent } };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        throw new Error("Event does not exist.");
      }
    }
  }
}
