import {
  ContextType,
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import HackleManager from "hackle-js-bridge";

export const HackleUserVersionContext = createContext({
  userVersion: 0,
});

interface ProviderProps {
  hackleClient: ReturnType<HackleManager["createInstance"]>;
  timeout?: number;
}

export default function HackleProvider({
  children,
  hackleClient,
  timeout,
}: PropsWithChildren<ProviderProps>) {
  const [value, setValue] = useState<
    ContextType<typeof HackleUserVersionContext>
  >({
    userVersion: 0,
  });


  useEffect(() => {
    hackleClient
      .onInitialized({ timeout })
      .then(
        () => {
          setValue((prevState) => {
            return {
              ...prevState,
              initialized: true,
            };
          });
        },
        () => {
          setValue((prevState) => {
            return {
              ...prevState,
              initialized: true,
            };
          });
        }
      )
      .catch(() => {
        setValue((prevState) => {
          return {
            ...prevState,
            initialized: true,
          };
        });
      });
  }, [hackleClient]);

  useEffect(() => {
    const onUserUpdated = () => {
      setValue((prevState) => ({
        ...prevState,
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
