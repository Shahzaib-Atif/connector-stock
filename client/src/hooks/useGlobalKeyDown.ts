import { useEffect } from "react";

export function useGlobalKeyDown(
  searchQuery: string,
  onScan: (code: string) => void
) {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only handle Enter key
      if (e.key !== "Enter") return;

      // Don't interfere if user is typing in the input (let the input handler deal with it)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // If there's a search query, trigger the scan
      if (searchQuery.trim()) {
        e.preventDefault();
        onScan(searchQuery);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [searchQuery, onScan]);
}
