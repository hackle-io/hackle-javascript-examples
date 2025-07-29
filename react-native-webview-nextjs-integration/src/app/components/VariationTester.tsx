"use client";

import useVariation from "../hooks/useVariation";

interface VariationTesterProps {}

export default function VariationTester({}: VariationTesterProps) {
  const { data: variation } = useVariation(40, {
    suspense: true,
  });

  return <pre style={{ fontSize: 54 }}>{variation}</pre>;
}
