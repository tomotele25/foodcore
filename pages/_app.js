import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import NetworkStatus from "@/components/NetworkStatus";
import { Toaster } from "react-hot-toast";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" />
      <CartProvider>
        <SessionProvider session={pageProps.session}>
          <NetworkStatus />
          <Component {...pageProps} />
        </SessionProvider>
      </CartProvider>
    </>
  );
}
