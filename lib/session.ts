import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "karrot-session",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export const loginByUserId = async (userId: number) => {
  const session = await getSession();
  session.id = userId;
  await session.save();
};
