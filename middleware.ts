import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      // 유저가 로그인 하지 않은 상태에서 로그인 유저만 접근 가능한 url에 접속했을 때
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // 이미 로그인 한 유저가 비로그인 유저만 접근할 수 있는 url에 접근했을 때
    return NextResponse.redirect(new URL("/products", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
