import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { getBoxDetails, parseConnector } from "../utils/functions/connector";
import { ROUTES } from "@/components/AppRoutes";
import { getConnectorId } from "@shared/utils/getConnectorId";

/** Hook for handling QR code scanning logic */
export const useScan = () => {
  const navigate = useNavigate();
  const masterData = useAppSelector((state) => state.masterData);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (inputCode: string) => {
    setError(null);

    if (!masterData.data || masterData.error) {
      setError("Error while fetching data from server!");
      return;
    }

    const code = inputCode.trim();
    const upperCode = code.toUpperCase();

    // Handle complex amostra strings (e.g. W382P2+C248P1)
    if (code.includes("+")) {
      const parsedId = getConnectorId(upperCode);
      if (parsedId.length === 6 || parsedId.length === 8) {
        return handleConnectorNav(parsedId);
      }
    }

    if (code.length === 6 || code.length === 8) handleConnectorNav(upperCode);
    else if (code.length === 4) handleBoxNav(upperCode);
    else handleAccessoryNav(upperCode);
  };

  const clearError = () => setError(null);

  //#region -- Helper functions
  const handleConnectorNav = (upperCode: string) => {
    const connector = parseConnector(upperCode, masterData.data);

    if (connector) navigate(`${ROUTES.CONNECTORS}/${upperCode}`);
    else setError("Connector not found!");
  };

  const handleBoxNav = (upperCode: string) => {
    const box = getBoxDetails(upperCode, masterData.data);

    if (box) navigate(`${ROUTES.BOXES}/${upperCode}`);
    else setError("Box not found!");
  };

  const handleAccessoryNav = (id: string) => {
    const accessoryId = Number(id);

    if (!Number.isInteger(accessoryId)) {
      setError("Invalid code. Unable to find this item!");
      return;
    }

    if (!masterData?.data?.accessories) {
      setError("Accessory not found!");
      return;
    }

    const accessory = masterData.data.accessories[accessoryId];

    if (accessory) navigate(`${ROUTES.ACCESSORIES}/${accessoryId}`);
    else setError("Invalid code. Unable to find this item!");
  };
  //#endregion

  return { handleScan, error, clearError };
};
