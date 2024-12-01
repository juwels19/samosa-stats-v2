"use server";

import { User } from "@clerk/backend";
import { revalidatePath } from "next/cache";
import clerkClient from "~/server/clerk";

export type ClerkUser = {
  clerkId: string;
  fullName?: string | null;
  firstName: string | null;
  lastName: string | null;
  email?: string;
  privateMetadata: {
    admin?: boolean;
    approver?: boolean;
    rejected?: boolean;
    approved?: boolean;
  };
  imageUrl?: string;
};

export async function getClerkUsers(): Promise<ClerkUser[]> {
  // @ts-expect-error - this is a bug in the types
  const allUsers = await clerkClient.users.getUserList({ limit: 100 });

  const userData: ClerkUser[] = [];

  allUsers.data.map((user: User) =>
    userData.push({
      clerkId: user.id,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      privateMetadata: user.privateMetadata,
      imageUrl: user.imageUrl,
    })
  );

  return userData;
}

export async function updateClerkUserPrivateMetadata({
  clerkId,
  newPrivateMetadata,
}: {
  clerkId: string;
  newPrivateMetadata: ClerkUser["privateMetadata"];
}): Promise<string> {
  try {
    // @ts-expect-error - this is a bug in the types
    const updateUser = await clerkClient.users.updateUser(clerkId, {
      privateMetadata: newPrivateMetadata,
    });
    revalidatePath("/admin");
    return JSON.stringify(updateUser);
  } catch (error) {
    return JSON.stringify(error);
  }
}
