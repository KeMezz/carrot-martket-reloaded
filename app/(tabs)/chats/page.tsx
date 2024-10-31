// TODO: 채팅방의 읽음 여부를 확인하고 표시하기
// TODO: 최신 메시지가 변경되면 캐시로 채팅 목록까지 갱신시키기

import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";

async function getChatRooms() {
  const session = await getSession();
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id!,
        },
      },
    },
    include: {
      messages: {
        select: {
          text: true,
        },
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
      users: {
        where: {
          id: {
            not: session.id,
          },
        },
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return chatRooms;
}

const getCachedChatRooms = nextCache(getChatRooms, ["chatrooms"], {
  tags: [`chatrooms`],
});

export default async function Chat() {
  const chatRooms = await getCachedChatRooms();
  return (
    <div className="p-2 divide-y">
      {chatRooms.map((chatRoom) => (
        <Link
          href={`/chats/${chatRoom.id}`}
          key={chatRoom.id}
          className="flex gap-4 p-4 items-center text-white"
        >
          {chatRoom.users[0].avatar ? (
            <Image
              src={chatRoom.users[0].avatar}
              width={40}
              height={40}
              alt={chatRoom.users[0].username}
              className="size-14 rounded-full"
            />
          ) : null}
          <div>
            <h3 className="font-bold">{chatRoom.users[0].username}</h3>
            <p>{chatRoom.messages[0].text}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
