import HackleManager from "hackle-js-bridge";

const manager = new HackleManager();
const hackleClient = manager.createInstance(
  process.env.NEXT_PUBLIC_HACKLE_SDK_KEY!,
  {
    exposureEventDedupIntervalMillis: 1000,
  }
);

export default hackleClient;
