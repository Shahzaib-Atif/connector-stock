import React from "react";

export function useConnectorId(amostra?: string) {
  return React.useMemo(() => {
    if (!amostra) return "";
    if (amostra.includes("+")) {
      return amostra.split("+")[0].trim().substring(0, 6);
    }
    return amostra.trim();
  }, [amostra]);
}
