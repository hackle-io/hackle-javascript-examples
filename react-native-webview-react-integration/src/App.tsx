import { Suspense } from "react";
import VariationTester from "./components/VariationTester";
import HackleProvider from "./context";
import hackleClient from "./modules/client";
import Loader from "./components/Loader";
import FeatureTester from "./components/FeatureTester";

function App() {
  return (
    <main>
      <HackleProvider hackleClient={hackleClient}>
        <div>
          <h2>Experiment [key: 50]</h2>
          <Suspense fallback={<Loader />}>
            <VariationTester />
          </Suspense>
        </div>
        <div>
          <h2>Feature Flag [key: 50]</h2>
          <Suspense fallback={<Loader />}>
            <FeatureTester />
          </Suspense>
        </div>
      </HackleProvider>
    </main>
  );
}

export default App;
