import { useRef, useCallback } from "react";

function useDebouncedFunction<T extends (...args: unknown[]) => void>(
  callback: T,
  waitTime: number
): (...args: Parameters<T>) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(...args);
      }, waitTime);
    },
    [callback, waitTime]
  );
}

export default useDebouncedFunction;
