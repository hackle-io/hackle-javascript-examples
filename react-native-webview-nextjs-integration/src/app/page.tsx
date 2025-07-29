import Image from "next/image";
import styles from "./page.module.css";
import { Suspense } from "react";
import Loader from "./components/Loader";
import VariationTester from "./components/VariationTester";
import FeatureTester from "./components/FeatureTester";
import UserController from "./components/UserController";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <h2>Experiment [key: 40]</h2>
          <Suspense fallback={<Loader />}>
            <VariationTester />
          </Suspense>
        </div>
        <div>
          <h2>Feature Flag [key: 22]</h2>
          <Suspense fallback={<Loader />}>
            <FeatureTester />
          </Suspense>
        </div>
        <UserController />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
