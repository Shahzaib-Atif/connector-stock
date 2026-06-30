import { useAppSelector } from "@/store/hooks";
import { useState } from "react";

function useMissingConnectorWarning() {
  const { data: masterData } = useAppSelector((state) => state.masterData);
  const [warningMessage, setWarningMessage] = useState("");

  const clearWarning = () => {
    setWarningMessage("");
  };

  const checkConnectorWarning = (amostra: string): boolean => {
    const exists =
      masterData?.connectors &&
      Object.keys(masterData.connectors).includes(amostra);

    if (exists) return true;

    const message = `Connector ${amostra} not found in the inventory system. Please choose one of these options.`;
    setWarningMessage(message);
    return false;
  };

  return {
    checkConnectorWarning,
    warningMessage,
    clearWarning,
  };
}

export default useMissingConnectorWarning;
