import Head from "next/head";
import { GetServerSideProps } from "next";
import { getExperimentVariationAsync } from "@/hackle/actions";
import { resolveServerSideUser } from "@/hackle/users";
import { IMAGE_VARIATION_A, IMAGE_VARIATION_B } from "@/assets/variation";
import { EXPERIMENT_KEYS } from "@/hackle/featureKey";

interface ServerSideVariationProps {
  variation: string;
  decisionReason: string;
}
export default function ServerSide({
  variation: homepageVaraitionKey,
  decisionReason,
}: ServerSideVariationProps) {
  return (
    <>
      <Head>
        <title>ServerSide Variation Example</title>
      </Head>
      <main>
        {/* not set height, for triggering layout shift */}
        <div
          style={{
            width: 500,
          }}>
          <img
            src={
              homepageVaraitionKey === "A"
                ? IMAGE_VARIATION_A
                : IMAGE_VARIATION_B
            }
            alt="image-variations"
          />
        </div>
        <div>{decisionReason}</div>
      </main>
    </>
  );
}

export const getServerSideProps = (async ({ req }) => {
  const user = resolveServerSideUser({ req });
  const { reason, variation } = await getExperimentVariationAsync(
    user,
    EXPERIMENT_KEYS.DEMO
  );

  return {
    props: {
      variation,
      decisionReason: String(reason),
      user,
    },
  };
}) satisfies GetServerSideProps<ServerSideVariationProps>;
