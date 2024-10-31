"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function saveMessage(text: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      text,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  revalidateTag("chatrooms");
}
