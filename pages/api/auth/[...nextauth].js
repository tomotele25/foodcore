import NextAuth from "next-auth";
import { customProvider } from "@/services/CustomProvider";

export const nextOptions = {
  providers: [customProvider],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.businessName = user.businessName;
        token.fullname = user.fullname;
        token.location = user.location;
      }
      return token;
    },
    async session({ session, token }) {
      session.vendor = {
        id: token.id,
        email: token.email,
        accessToken: token.accessToken,
        businessName: token.businessName,
        fullname: token.fullname,
        location: token.location,
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
};

export default NextAuth(nextOptions);
