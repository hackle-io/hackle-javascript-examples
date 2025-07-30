"use client";

import { useContext } from "react";
import hackleClient from "../modules/client";
import { HackleUserVersionContext } from "../context";
import { useAsyncClient } from "./useAsyncClient";

export default function useFeature(
  featureKey: number,
  defaultValue: boolean,
  options?: { suspense: boolean }
) {
  const { userVersion } = useContext(HackleUserVersionContext);
  const { data: isOn, isLoading } = useAsyncClient(
    () => hackleClient.isFeatureOn(featureKey),
    [userVersion],
    options
  );

  return {
    isOn: isOn ?? defaultValue,
    isLoading,
  };
}
