import Comments from "@/components/comments";
import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPost(id: number) {
  try {
    // update로 조회수를 갱신함과 동시에 post의 내용을 select 해온다.
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return comments;
}

async function getUserInfo() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      avatar: true,
    },
  });

  return user;
}

function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

function getCachedPost(postId: number) {
  const cachedOperation = nextCache(getPost, ["post-detail"], {
    tags: [`post-detail-${postId}`],
  });
  return cachedOperation(postId);
}

function getCachedComments(postId: number) {
  const cachedOperation = nextCache(getComments, ["post-comments"], {
    tags: [`post-comments-${postId}`],
  });
  return cachedOperation(postId);
}

async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    isLiked: Boolean(isLiked),
    likeCount,
  };
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  const user = await getUserInfo();
  const comments = await getCachedComments(id);

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  return (
    <section className="p-5 text-white flex flex-col gap-4">
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={28}
            height={28}
            className="size-12 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </section>
      <Comments comments={comments} postId={id} user={user} />
    </section>
  );
}
