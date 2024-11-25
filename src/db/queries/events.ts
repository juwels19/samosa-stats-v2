"use server";
import { Prisma } from "@prisma/client";
import { compareAsc, formatISO, parseJSON } from "date-fns";
import { revalidatePath } from "next/cache";
import prisma from "~/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventsWithPicks = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: { Pick: { include: { Categories: true } } },
});

export type EventWithPicks = Prisma.EventGetPayload<typeof eventsWithPicks>;

export async function getAllEventsAndPicksForUser(clerkId: string) {
  const events = await prisma.event.findMany({
    where: { Season: { isActive: true } },
    include: {
      Pick: { where: { userId: clerkId }, include: { Categories: true } },
    },
  });
  return events.sort((a, b) =>
    compareAsc(parseJSON(a.startDate), parseJSON(b.startDate))
  );
}

export async function getEventByEventCode(
  eventCode: string
): Promise<EventWithPicks | null> {
  const event = await prisma.event.findUnique({
    where: { eventCode },
    include: { Pick: { include: { Categories: true } } },
  });
  return event;
}

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
