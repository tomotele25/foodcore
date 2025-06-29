import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="beforeInteractive"
      />

      <CartProvider>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </CartProvider>
    </>
  );
}
