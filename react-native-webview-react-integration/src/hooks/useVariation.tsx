import { useContext } from "react";
import hackleClient from "../modules/client";
import { HackleUserVersionContext } from "../context";
import { useAsyncClient } from "./useAsyncClient";

export default function useVariation(
  experimentKey: number,
  defaultValue: string,
  options?: {
    suspense: boolean;
  }
) {
  const { userVersion } = useContext(HackleUserVersionContext);
  const { data: variation, isLoading } = useAsyncClient(
    () => hackleClient.variation(experimentKey),
    [userVersion],
    options
  );

  return {
    variation: variation ?? defaultValue,
    isLoading,
  };
}
