import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./lib/database/mongodb";
import { User } from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Runs whenever a user signs in
    async signIn({ user, account }) {
      if (!user.email || !account) return false;
      if (account.provider !== "google") return false;

      await connectDB();

      // Upsert user
      await User.findOneAndUpdate(
        { email: user.email },
        {
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          provider: "google",
          providerAccountId: account.providerAccountId,
        },
        { upsert: true, new: true },
      );

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        token.sub = dbUser._id.toString();
        // token.isOAuth = dbUser.isOAuth;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        userID: token.sub,
        provider: token.provider,
      };
    },
  },
});
