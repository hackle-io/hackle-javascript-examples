"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Suspense } from "react";
import Loader from "./components/Loader";
import VariationTester from "./components/VariationTester";
import FeatureTester from "./components/FeatureTester";
import UserController from "./components/UserController";
import CustomTracker from "./components/CustomTracker";
import RemoteConfig from "./components/RemoteConfig";

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
        <div>
          <h2>Remote Config [key: 'targeting_rule_test']</h2>
          <Suspense fallback={<Loader />}>
            <RemoteConfig />
          </Suspense>
        </div>
        <UserController />
        <CustomTracker />
      </main>
    </div>
  );
}
