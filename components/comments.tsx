"use client";

import { postComment } from "@/app/(tabs)/life/[id]/actions";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { startTransition, useOptimistic } from "react";
import { useForm } from "react-hook-form";

interface CommentsProps {
  comments: {
    text: string;
    user: { username: string; avatar: string | null };
  }[];
  postId: number;
  user: {
    username: string;
    avatar: string | null;
  } | null;
}

interface CommentFormData {
  text: string;
  postId: number;
}

export default function Comments({ comments, postId, user }: CommentsProps) {
  const { register, handleSubmit, setValue } = useForm<CommentFormData>();
  const [state, reducerFn] = useOptimistic(
    comments,
    (prevState, text: string) => [
      ...prevState,
      {
        text,
        user: {
          username: user!.username,
          avatar: user!.avatar,
        },
      },
    ]
  );

  const onSubmit = (formData: CommentFormData) => {
    const { text, postId } = formData;
    startTransition(() => reducerFn(text));
    postComment(text, postId);
    setValue("text", "");
  };

  return (
    <>
      <section className="flex flex-col gap-5 border-t py-4">
        {state.map((comment, index) => (
          <div className="flex gap-4" key={index}>
            <Image
              width={16}
              height={16}
              className="size-10 rounded-full mt-[2px]"
              src={comment.user.avatar!}
              alt={comment.user.username}
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold">{comment.user.username}</h4>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fixed bottom-20 w-full flex gap-2 p-4 bg-neutral-900 max-w-screen-md left-1/2 translate-x-[-50%]"
      >
        <input
          type="text"
          placeholder="코멘트를 입력하세요.."
          className="w-full rounded-full border-none text-black"
          {...register("text", { required: true })}
        />
        <input
          type="hidden"
          value={postId}
          {...register("postId", { required: true })}
        />
        <button className="bg-orange-500 rounded-full flex-shrink-0 w-10 h-10 flex justify-center items-center">
          <ArrowUpIcon className="text-white size-6" />
        </button>
      </form>
    </>
  );
}
