"use client";

import useFeature from "../hooks/useFeature";

interface FeatureTesterProps {}

export default function FeatureTester({}: FeatureTesterProps) {
  const { data: isOn } = useFeature(22, {
    suspense: true,
  });

  return <pre style={{ fontSize: 54 }}>{isOn ? "On" : "Off"}</pre>;
}
