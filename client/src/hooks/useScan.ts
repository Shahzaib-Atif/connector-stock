import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { getBoxDetails, parseConnector } from "../services/connectorService";

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

    let code = inputCode.trim();

    // 1. Check if it's a full URL (handle old IP stickers)
    if (code.startsWith("http")) {
      try {
        const url = new URL(code);
        const pathParts = url.pathname.split("/").filter(Boolean);
        // Expecting /box/ID or /connector/ID
        if (pathParts.length >= 2) {
          const type = pathParts[pathParts.length - 2].toLowerCase();
          const id = pathParts[pathParts.length - 1].toUpperCase();

          if (type === "box") return handleBoxNav(id);
          if (type === "connector") return handleConnectorNav(id);
          if (type === "accessory") return handleAccessoryNav(id);
        }
      } catch (e) {
        console.warn("Failed to parse scanned URL", e);
      }
    }

    // 2. Check for "Pure Data" prefixes (new stickers)
    if (code.includes(":")) {
      const [prefix, id] = code.split(":");
      const cleanPrefix = prefix.toLowerCase();
      const upperId = id.toUpperCase();

      if (cleanPrefix === "box") return handleBoxNav(upperId);
      if (cleanPrefix === "connector") return handleConnectorNav(upperId);
      if (cleanPrefix === "accessory") return handleAccessoryNav(upperId);
    }

    // 3. Falling back to length-based detection for raw IDs
    const upperCode = code.toUpperCase();
    if (code.length === 6) handleConnectorNav(upperCode);
    else if (code.length === 4) handleBoxNav(upperCode);
    else handleAccessoryNav(upperCode);
  };

  const clearError = () => setError(null);

  //#region -- Helper functions
  const handleConnectorNav = (upperCode: string) => {
    const connector = parseConnector(upperCode, masterData.data);

    if (connector) navigate(`/connector/${upperCode}`);
    else setError("Connector not found!");
  };

  const handleBoxNav = (upperCode: string) => {
    const box = getBoxDetails(upperCode, masterData.data);

    if (box) navigate(`/box/${upperCode}`);
    else setError("Box not found!");
  };

  const handleAccessoryNav = (id: string) => {
    // Search for accessory by RefClient (clientRef field)
    if (!masterData.data.accessories) {
      setError("Accessory not found!");
      return;
    }

    const accessory = masterData.data.accessories[id];

    if (accessory) navigate(`/accessory/${id}`);
    else setError("Invalid code. Unable to find this item!");
  };
  //#endregion

  return { handleScan, error, clearError };
};
