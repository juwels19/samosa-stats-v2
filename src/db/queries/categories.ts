"use server";

import { Category, Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import { revalidatePath } from "next/cache";
import prisma from "~/db";

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return categories;
}

export async function createCategory({ text }: { text: string }) {
  const timestamp = formatISO(new Date());
  try {
    const newCategory = await prisma.category.create({
      data: {
        text,
        createdAt: timestamp,
      },
    });

    revalidatePath("/settings");
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

export async function updateCategories({
  categories,
}: {
  categories: Category[];
}) {
  try {
    const updatedCategories = await prisma.$transaction(
      categories.map((category) =>
        prisma.category.update({
          where: {
            id: category.id,
          },
          data: {
            text: category.text,
          },
        })
      )
    );

    console.log(updatedCategories);

    revalidatePath("/settings");
    return {
      success: true,
      data: { updatedCategories: JSON.stringify(updatedCategories) },
    };
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("There was an error updating the categories.");
    }
  }
}