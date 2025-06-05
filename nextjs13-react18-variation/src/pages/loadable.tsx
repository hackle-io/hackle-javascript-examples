import { useLoadableVariationDetail } from "@hackler/react-sdk";
import classes from "@/styles/Loader.module.css";
import { IMAGE_VARIATION_A, IMAGE_VARIATION_B } from "@/assets/variation";
import { EXPERIMENT_KEYS } from "@/hackle/featureKey";
import Head from "next/head";

const Loader = () => (
  <svg
    className={classes.loader}
    xmlns="http://www.w3.org/2000/svg"
    fill="#ffffff"
    version="1.1"
    id="Capa_1"
    width="250px"
    height="250px"
    viewBox="0 0 26.349 26.35">
    <g>
      <g>
        <circle cx="13.792" cy="3.082" r="3.082" />
        <circle cx="13.792" cy="24.501" r="1.849" />
        <circle cx="6.219" cy="6.218" r="2.774" />
        <circle cx="21.365" cy="21.363" r="1.541" />
        <circle cx="3.082" cy="13.792" r="2.465" />
        <circle cx="24.501" cy="13.791" r="1.232" />
        <path d="M4.694,19.84c-0.843,0.843-0.843,2.207,0,3.05c0.842,0.843,2.208,0.843,3.05,0c0.843-0.843,0.843-2.207,0-3.05    C6.902,18.996,5.537,18.988,4.694,19.84z" />
        <circle cx="21.364" cy="6.218" r="0.924" />
      </g>
    </g>
  </svg>
);

/**
 * useLoadable* hooks.
 * isLoading is remain `false` while hackleClient is initializing.
 */
export default function Loadable() {
  const { isLoading, decision } = useLoadableVariationDetail(
    EXPERIMENT_KEYS.DEMO
  );
  return (
    <>
      <Head>
        <title>LoadableHooks example</title>
      </Head>
      <main>
        {/* not set height, for triggering layout shift */}
        <div
          style={{
            width: 500,
          }}>
          {isLoading ? (
            <Loader />
          ) : (
            <img
              src={
                decision.variation === "A"
                  ? IMAGE_VARIATION_A
                  : IMAGE_VARIATION_B
              }
              alt="image-variations"
            />
          )}
        </div>
        <div>{String(decision.reason)}</div>
      </main>
    </>
  );
}
