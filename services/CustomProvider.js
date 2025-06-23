import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const customProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email", placeholder: "you@example.com" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    try {
      const res = await axios.post(
        "http://localhost:2005/api/auth/vendor/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      const vendor = res.data.vendor;
      const accessToken = res.data.accessToken;

      if (res.data.success && vendor) {
        return {
          id: vendor.id,
          email: vendor.email,
          accessToken,
          businessName: vendor.businessName,
          location: vendor.location,
          fullname: vendor.fullname,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  },
});
