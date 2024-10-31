"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessagesListProps) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        created_at: new Date(),
        userId,
        user: {
          username: "",
          avatar: null,
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        text,
        created_at: new Date(),
        userId,
        user: { username, avatar },
      },
    });
    await saveMessage(text, chatRoomId);
    setText("");
  };

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
    );
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="flex flex-col justify-end min-h-screen gap-5 p-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="rounded-full size-8"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              } p-2.5 rounded-md`}
            >
              {message.text}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={text}
          className="w-full h-10 px-5 transition bg-transparent border-none rounded-full focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-neutral-50 placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="text-orange-500 transition-colors size-10 hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
