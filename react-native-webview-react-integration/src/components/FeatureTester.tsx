import useFeature from "../hooks/useFeature";

interface FeatureTesterProps {}

export default function FeatureTester({}: FeatureTesterProps) {
  const { isOn } = useFeature(40, false, {
    suspense: true,
  });

  return (
    <pre style={{ fontSize: 54, height: 400, backgroundColor: "#0065ff" }}>
      {isOn ? "On" : "Off"}
    </pre>
  );
}
