import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </CartProvider>
  );
}
