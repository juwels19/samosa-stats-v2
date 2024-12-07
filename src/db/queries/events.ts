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

export async function getEventsReadyForScoring() {
  const events = await prisma.event.findMany({
    where: {
      Season: { isActive: true },
      isComplete: true,
      isSubmissionClosed: true,
    },
    include: {
      Pick: { include: { Categories: true } },
    },
  });
  return events.sort((a, b) =>
    compareAsc(parseJSON(a.startDate), parseJSON(b.startDate))
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventCodeWithPickCounts = Prisma.validator<Prisma.EventDefaultArgs>()({
  select: {
    eventCode: true,
    _count: {
      select: {
        Pick: true,
      },
    },
  },
});

export type EventCodeWithPickCounts = Prisma.EventGetPayload<
  typeof eventCodeWithPickCounts
>;

export async function getNumberOfPicksForEachEvent() {
  const picks = await prisma.event.findMany({
    where: { Season: { isActive: true } },
    select: {
      eventCode: true,
      _count: {
        select: {
          Pick: true,
        },
      },
    },
  });
  return picks;
}

export async function getEventByEventCode(
  eventCode: string
): Promise<EventWithPicks | null> {
  const event = await prisma.event.findUnique({
    where: { eventCode },
    include: {
      Pick: { orderBy: { score: "desc" }, include: { Categories: true } },
    },
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
    displayName: string;
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
        displayName: eventData.displayName,
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
    displayName: string;
  };
}) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { eventCode: eventData.eventCode },
      data: {
        numberOfTeamPicks: eventData.numTeamPicks,
        numberOfCategoryPicks: eventData.numCategoryPicks,
        displayName: eventData.displayName,
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

export async function setEventCountdownActive({
  eventId,
}: {
  eventId: number;
}) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        isCountdownActive: true,
      },
    });

    return {
      success: true,
      data: { updatedEvent: JSON.stringify(updatedEvent) },
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      console.log(e.code);
      if (e.code === "P2002") {
        throw new Error("Event does not exist.");
      }
    }
  }
}
