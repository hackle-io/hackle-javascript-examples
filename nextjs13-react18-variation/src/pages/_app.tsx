import { hackleClient } from "@/hackle/hackleClient";
import "@/styles/globals.css";
import { HackleProvider } from "@hackler/react-sdk";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HackleProvider hackleClient={hackleClient} supportSSR>
      <Component {...pageProps} />
    </HackleProvider>
  );
}
