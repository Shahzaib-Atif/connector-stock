import { useEffect, useCallback } from "react";

// Triggers callback when user clicks outside the element
export function useClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  onClickOutside: () => void
) {
  // Memoize the callback to prevent unnecessary effect re-runs
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    },
    [ref, onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
}
