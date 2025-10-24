import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    // No signed-in user in this request context
    return null;
  }

  try {
    // Defensive extraction of name/email
    const name = user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null;
    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      null;

    console.log(`[checkUser] upserting clerkUserId=${user.id} email=${email}`);

    const upserted = await db.user.upsert({
      where: { clerkUserId: user.id },
      create: {
        clerkUserId: user.id,
        email,
        name,
        imageUrl: user.imageUrl || null,
      },
      update: {
        email,
        name,
        imageUrl: user.imageUrl || null,
      },
    });

    return upserted;
  } catch (error) {
    console.error("[checkUser] error upserting user:", error);
    return null;
  }
};
