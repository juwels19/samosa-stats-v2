"use server";

import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import prisma from "~/db";

export async function getAllCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function createCategory({ text }: { text: string }) {
  const timestamp = formatISO(new Date());
  try {
    const newCategory = await prisma.category.create({
      data: {
        createdAt: timestamp,
        text,
      },
    });

    return { success: true, data: { newCategory } };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        throw new Error("Category already exists.");
      }
    }
  }
}
