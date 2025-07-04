import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import NetworkStatus from "@/components/NetworkStatus";

export default function App({ Component, pageProps }) {
  return (
    <>
      <CartProvider>
        <SessionProvider session={pageProps.session}>
          <NetworkStatus />
          <Component {...pageProps} />
        </SessionProvider>
      </CartProvider>
    </>
  );
}
