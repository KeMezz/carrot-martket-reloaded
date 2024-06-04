import db from "@/lib/db";
import getSession, { loginByUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// TODO: request와 response 부분을 별도의 함수로 분리하기
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    // TODO: /github/error 같은 페이지로 리다이렉트
    return new Response(null, {
      status: 400,
    });
  }
  // TODO: user/emails로 새로운 요청을 보내서 이메일을 가져옵니다.
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    // 해당 리퀘스트는 이를 요청하는 모든 유저마다 다르게 기록되어야 하므로, 캐싱을 하지 않습니다.
    cache: "no-cache",
  });
  const { id, avatar_url, login } = await userProfileResponse.json();
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await loginByUserId(user.id);
    return redirect("/profile");
  }
  // TODO: 깃허브 로그인 처리 전에 이미 존재하는 유저명이 있는지 확인하기
  const newUser = await db.user.create({
    data: {
      username: login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await loginByUserId(newUser.id);
  return redirect("/profile");
}
