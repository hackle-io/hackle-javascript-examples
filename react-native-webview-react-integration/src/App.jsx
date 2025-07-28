import { Suspense } from "react";
import "./App.css";
import VariationTester from "./components/VariationTester";
import HackleProvider from "./context";
import hackleClient from "./modules/client";

function App() {
  return (
    <main>
      <HackleProvider hackleClient={hackleClient}>
        <Suspense
          fallback={
            <div
              style={{
                fontSize: 54,
              }}>
              으아아악 폴백 서스펜스 폴백 폴백!!!! 후퇴하라
            </div>
          }>
          <VariationTester />
        </Suspense>
      </HackleProvider>
    </main>
  );
}

export default App;
