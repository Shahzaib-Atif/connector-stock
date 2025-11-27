import { useEffect, useCallback } from "react";

/**
 * Global keyboard listener for back navigation
 * Triggers onBack when Backspace key is pressed anywhere on the page
 */
export function useGlobalBackNavigation(onBack: () => void) {
  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only handle Backspace key
      if (e.key !== "Backspace") return;

      // Don't interfere if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // Trigger back navigation
      e.preventDefault();
      onBack();
    },
    [onBack]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);
}
