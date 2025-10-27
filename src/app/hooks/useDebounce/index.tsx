import { useRef, useCallback } from "react";

function useDebouncedFunction<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  waitTime: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void callback(...args);
      }, waitTime);
    },
    [callback, waitTime]
  );
}

export default useDebouncedFunction;
