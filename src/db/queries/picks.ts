"use server";

import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import prisma from "~/db";

export async function submitPickForEvent({
  eventId,
  userId,
  userFullname,
  teamNumbers,
  categoryIds,
  categories,
  displayName,
}: {
  eventId: number;
  userId: string;
  userFullname: string;
  teamNumbers: string[];
  categoryIds: string[];
  categories: string[];
  displayName: string;
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
