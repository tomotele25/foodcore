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
        token.vendorId = user.vendorId;
        token.accessToken = user.accessToken;
        token.fullname = user.fullname;
        token.role = user.role;
        token.contact = user.contact;
        token.businessName = user.businessName;
        token.location = user.location;
        token.address = user.address;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        vendorId: token.vendorId,
        email: token.email,
        fullname: token.fullname,
        accessToken: token.accessToken,
        role: token.role,
        contact: token.contact,
        address: token.address,
        location: token.location,
        businessName: token.businessName,
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  jwt: {
    maxAge: 60 * 60,
  },
};

export default NextAuth(nextOptions);
