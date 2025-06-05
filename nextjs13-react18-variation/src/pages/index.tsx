import Head from "next/head";
import Link from "next/link";

import classes from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Variation Comparison</title>
      </Head>
      <main className={classes.container}>
        <h1 className={classes.heading}>Hackle Variation Playground</h1>
        <ul className={classes.link__container}>
          <Link className={classes.link} href={`/loadable`}>
            useLoadableVariation
          </Link>

          <Link className={classes.link} href={`/server-side`}>
            ServerSide Variation
          </Link>
        </ul>
      </main>
    </>
  );
}
