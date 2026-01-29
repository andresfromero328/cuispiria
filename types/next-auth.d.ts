// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userID: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    provider?: string;
  }
}
