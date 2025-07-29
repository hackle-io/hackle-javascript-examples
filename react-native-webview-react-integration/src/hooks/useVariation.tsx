import { useContext } from "react";
import hackleClient from "../modules/client";
import { HackleUserVersionContext } from "../context";
import { useAsyncClient } from "./useAsyncClient";

export default function useVariation(
  experimentKey: number,
  options?: {
    suspense: boolean;
  }
) {
  const { userVersion } = useContext(HackleUserVersionContext);
  return useAsyncClient(
    () => hackleClient.variation(experimentKey),
    [userVersion],
    options
  );
}
