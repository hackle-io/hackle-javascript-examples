import { createInstance } from "@hackler/react-sdk";

export const hackleClient = createInstance(
  process.env.NEXT_PUBLIC_HACKLE_SDK_KEY!,
  {
    debug: true,
  }
);
