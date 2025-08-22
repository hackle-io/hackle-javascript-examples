import { Suspense } from "react";
import VariationTester from "./components/VariationTester";
import HackleProvider from "./context";
import hackleClient from "./modules/client";
import Loader from "./components/Loader";
import FeatureTester from "./components/FeatureTester";
import RemoteConfig from "./components/RemoteConfig";

function App() {
  return (
    <main>
      <HackleProvider hackleClient={hackleClient}>
        {/* A/B 테스트 */}
        <div>
          <h2>Experiment [key: 50]</h2>
          <Suspense fallback={<Loader />}>
            <VariationTester />
          </Suspense>
        </div>
        {/* 기능 플래그 */}
        <div>
          <h2>Feature Flag [key: 50]</h2>
          <Suspense fallback={<Loader />}>
            <FeatureTester />
          </Suspense>
        </div>

        <div>
          <h2>Remote Config [key: targeting_rule_test]</h2>
          <Suspense fallback={<Loader />}>
            <RemoteConfig />
          </Suspense>
        </div>

        <section>
          {/* 커스텀 이벤트 트래킹 */}
          <button
            onClick={() =>
              hackleClient.track({
                key: "click_button",
                properties: {
                  button_name: "custom",
                },
              })
            }>
            Track Custom Event
          </button>
        </section>
      </HackleProvider>
    </main>
  );
}

export default App;
