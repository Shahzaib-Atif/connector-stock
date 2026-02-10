import { useCallback, useEffect } from "react";

/**
 * Triggers when Escape key is pressed anywhere on the page
 */
export function useEscKeyDown(
  ref: React.RefObject<HTMLDivElement | null>,
  onEscKeyPressed: () => void,
) {
  const handleEscKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle Escape key
    if (e.key !== "Escape") return;

    if (ref.current) {
      onEscKeyPressed();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyDown);
    return () => {
      document.removeEventListener("keydown", handleEscKeyDown);
    };
  }, []);
}
