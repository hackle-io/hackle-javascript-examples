import { User } from "@hackler/react-sdk";
import { hackleClient } from "./hackleClient";

export const getExperimentVariationAsync = async (
  user: User,
  experimentKey: number
) => {
  await hackleClient.onInitialized();
  const variation = hackleClient.variationDetail(experimentKey, user);
  console.log("✅ [HACKLE] ", variation);
  return variation;
};
