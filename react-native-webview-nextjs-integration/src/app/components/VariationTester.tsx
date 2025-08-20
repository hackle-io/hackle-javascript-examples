"use client";

import useVariation from "../hooks/useVariation";
import Loader from "./Loader";

interface VariationTesterProps {}

export default function VariationTester({}: VariationTesterProps) {
  const { variation, isLoading } = useVariation(40, "A", {
    suspense: true,
  });

  return (
    <pre style={{ fontSize: 54, height: 400, backgroundColor: "#ff5500" }}>
      {variation}
    </pre>
  );
}
