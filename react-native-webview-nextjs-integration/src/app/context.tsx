"use client";

import {
  ContextType,
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import HackleManager from "./modules/web-view-integration";

export const HackleUserVersionContext = createContext({
  userVersion: 0,
});

interface ProviderProps {
  hackleClient: ReturnType<HackleManager["createInstance"]>;
}

export default function HackleProvider({
  children,
  hackleClient,
}: PropsWithChildren<ProviderProps>) {
  const [value, setValue] = useState<
    ContextType<typeof HackleUserVersionContext>
  >({
    userVersion: 0,
  });

  useEffect(() => {
    const onUserUpdated = () => {
      setValue((prevState) => ({
        userVersion: prevState.userVersion + 1,
      }));
    };

    hackleClient.on("user-updated", onUserUpdated);

    return () => {
      hackleClient.off("user-updated", onUserUpdated);
    };
  }, [hackleClient]);

  return (
    <HackleUserVersionContext.Provider value={value}>
      {children}
    </HackleUserVersionContext.Provider>
  );
}
