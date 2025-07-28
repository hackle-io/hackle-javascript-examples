import { useContext, useEffect, useRef, useState } from "react";
import hackleClient from "../modules/client";
import { useLoading } from "react-simplikit";
import { HackleUserVersionContext } from "../context";

export default function useVariation(
  experimentKey,
  options?: {
    suspense: boolean;
  }
) {
  const { userVersion } = useContext(HackleUserVersionContext);
  const [isLoading, startTransition] = useLoading();
  const [variation, setVariation] = useState<string>("A");

  const promise = useRef<Promise<unknown> | null>(null);

  if (options?.suspense && promise.current) throw promise.current;

  useEffect(() => {
    promise.current = startTransition(
      hackleClient
        .variation(experimentKey)
        .then((res) => {
          promise.current = null;
          setVariation(res);
        })
        .catch((r) => console.error(r))
    );
  }, [userVersion]);

  return {
    isLoading,
    variation,
  };
}
