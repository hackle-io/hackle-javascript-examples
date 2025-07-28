import useVariation from "../hooks/useVariation";
import hackleClient from "../modules/client";

interface VariationTesterProps {}

let a = 0;

export default function VariationTester({}: VariationTesterProps) {
  const { isLoading, variation } = useVariation(40, {
    suspense: true,
  });

  return (
    <section>
      {isLoading ? "로딩중....." : "로딩 끝!!!!!"}
      <pre>{variation}</pre>

      <button onClick={() => {}}>클릭으로 업데이트=</button>

      <button
        onClick={() => {
          hackleClient
            .setDeviceId(`123421919-rich-12515rwqrqwrqw12534-${++a}`)
            .then((res) => {
              hackleClient.getUser().then(console.log);
            });
        }}>
        deviceId를 바꿔보자
      </button>
    </section>
  );
}
