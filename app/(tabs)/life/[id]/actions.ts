"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function dislikePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function postComment(text: string, postId: number) {
  const session = await getSession();
  const comment = await db.comment.create({
    data: {
      userId: session.id!,
      postId: Number(postId),
      text,
    },
    select: {
      text: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  revalidateTag(`post-comments-${postId}`);

  return comment;
}
