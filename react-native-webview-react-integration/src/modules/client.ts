import HackleManager from "./web-view-integration";

const manager = new HackleManager();
const hackleClient = manager.createInstance(import.meta.env.VITE_SDK_KEY, {
  exposureEventDedupIntervalMillis: 1000,
});

export default hackleClient;
