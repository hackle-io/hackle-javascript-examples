"use client";

import useFeature from "../hooks/useFeature";
import Loader from "./Loader";

interface FeatureTesterProps {}

export default function FeatureTester({}: FeatureTesterProps) {
  const { isOn, isLoading } = useFeature(22, false, {
    suspense: true,
  });

  return (
    <pre style={{ fontSize: 54, height: 400, backgroundColor: "#0065ff" }}>
      {String(isOn)}
    </pre>
  );
}
