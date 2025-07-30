"use client";

import useVariation from "../hooks/useVariation";

interface VariationTesterProps {}

export default function VariationTester({}: VariationTesterProps) {
  const { variation } = useVariation(40, "A", {
    suspense: true,
  });

  return (
    <pre style={{ fontSize: 54, height: 400, backgroundColor: "#ff5500" }}>
      {variation}
    </pre>
  );
}
