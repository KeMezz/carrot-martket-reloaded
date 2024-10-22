"use client";

import { HandThumbUpIcon as ThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineThumbUpIcon } from "@heroicons/react/24/outline";
import { startTransition, useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/(tabs)/life/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState) => ({
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked
        ? prevState.likeCount - 1
        : prevState.likeCount + 1,
    })
  );

  const onClick = async () => {
    startTransition(() => reducerFn(undefined));
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full px-4 py-2 transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800 "
      }`}
    >
      {state.isLiked ? (
        <ThumbUpIcon className="size-4" />
      ) : (
        <OutlineThumbUpIcon className="size-4" />
      )}
      <span>
        {state.isLiked ? state.likeCount : `공감하기 (${state.likeCount})`}
      </span>
    </button>
  );
}
