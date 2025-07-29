import { useEffect, useRef, useState } from "react";

export function useAsyncClient<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = [],
  options?: { suspense?: boolean }
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const promise = useRef<Promise<T> | null>(null);

  if (options?.suspense && promise.current) throw promise.current;

  useEffect(() => {
    setIsLoading(true);
    promise.current = asyncFn();
    promise.current
      .then((res) => {
        setData(res);
      })
      .catch(() => {})
      .finally(() => {
        promise.current = null;
        setIsLoading(false);
      });
  }, deps);

  return { isLoading, data };
}
