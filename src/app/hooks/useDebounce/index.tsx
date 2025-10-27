import { useRef, useCallback } from "react";

function useDebouncedFunction<T extends (...args: any[]) => any>(
  callback: T,
  waitTime: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        void callback(...args); // allow async without changing return type
      }, waitTime);
    },
    [callback, waitTime]
  );
}

export default useDebouncedFunction;
