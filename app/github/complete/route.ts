import db from "@/lib/db";
import { loginByUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface AccessToken {
  error?: any;
  access_token: string;
}

interface GithubProfile {
  id: number;
  avatar_url: string;
  login: string;
  email: string;
}

// TODO: request와 response 부분을 별도의 함수로 분리하기
async function getAccessToken(code: string): Promise<AccessToken> {
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
  return await accessTokenResponse.json();
}

async function getGithubProfile(access_token: string): Promise<GithubProfile> {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    // 해당 리퀘스트는 이를 요청하는 모든 유저마다 다르게 기록되어야 하므로, 캐싱을 하지 않습니다.
    cache: "no-cache",
  });

  const emailProfileResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );

  const { id, avatar_url, login } = await userProfileResponse.json();
  const { email } = await emailProfileResponse.json();

  return { id, avatar_url, login, email };
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const { error, access_token } = await getAccessToken(code);
  if (error) {
    // TODO: /github/error 같은 페이지로 리다이렉트
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login, email } = await getGithubProfile(access_token);

  // TODO: 깃허브 로그인 처리 전에 이미 존재하는 유저명이 있는지 확인하기
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

  const isUsernameExist = await db.user.findFirst({
    where: {
      username: login,
    },
  });

  const newUser = await db.user.create({
    data: {
      username: isUsernameExist ? `${login}-gh` : login,
      email,
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
