import { useEffect, useRef } from "react";

export function useRenderingCount() {
  const count = useRef(1);

  useEffect(() => {
    count.current = count.current + 1;
  });

  return count.current;
}
