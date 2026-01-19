import { useAppSelector } from "@/store/hooks";
import { useState } from "react";

function useMissingConnectorWarning() {
  const { data: masterData } = useAppSelector((state) => state.masterData);
  const [firstWarningIssued, setFirstWarningIssued] = useState(false);

  const checkConnectorWarning = (
    amostra: string,
    setFormError: (error: string) => void
  ) => {
    const exists =
      masterData?.connectors &&
      Object.keys(masterData.connectors).includes(amostra);

    if (exists) return true;

    if (!firstWarningIssued) {
      setFormError(
        `Connector ${amostra} not found in the inventory system. Click the Create button again if you still want to proceed.`
      );
      setFirstWarningIssued(true);
      return false;
    }

    setFirstWarningIssued(false);
    return true;
  };

  return { checkConnectorWarning };
}

export default useMissingConnectorWarning;
