import { auth } from "@/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/meal-planning/:path*", "/library/:path*"],
};
