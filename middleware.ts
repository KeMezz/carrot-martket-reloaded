import { NextRequest } from "next/server";
import getSession from "./lib/session";

export async function middleware(request: NextRequest) {
  console.log(request.cookies.getAll());
  const session = await getSession();
  console.log(session);
  if (request.nextUrl.pathname === "/profile") {
    return Response.redirect(new URL("/", request.url));
  }
}
