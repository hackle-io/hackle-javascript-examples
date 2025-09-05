import HackleDevTools from "@hackler/javascript-devtools";
import HackleManager from "hackle-js-bridge";

const manager = new HackleManager();
const hackleClient = manager.createInstance(import.meta.env.VITE_SDK_KEY, {
  exposureEventDedupIntervalMillis: 1000,
  devTool: HackleDevTools,
});

export default hackleClient;
