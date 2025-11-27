import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
  getBoxDetails,
  parseConnector,
  constructAccessoryId,
} from "../services/connectorService";

export const useScan = () => {
  const navigate = useNavigate();
  const { masterData } = useAppSelector((state) => state.stock);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (inputCode: string) => {
    setError(null);

    if (!masterData) {
      console.warn("Redux data not loaded yet");
      return;
    }

    const code = inputCode.trim();
    const upperCode = code.toUpperCase();

    if (code.length === 6) handleConnectorNav(upperCode);
    else if (code.length === 4) handleBoxNav(upperCode);
    else handleAccessoryNav(upperCode);
  };

  const clearError = () => setError(null);

  //#region -- Helper functions
  const handleConnectorNav = (upperCode: string) => {
    const connector = parseConnector(upperCode, {}, masterData);

    if (connector) navigate(`/connector/${upperCode}`);
    else setError("Connector not found!");
  };

  const handleBoxNav = (upperCode: string) => {
    const box = getBoxDetails(upperCode, masterData);

    if (box) navigate(`/box/${upperCode}`);
    else setError("Box not found!");
  };

  const handleAccessoryNav = (code: string) => {
    // Search for accessory by RefClient (clientRef field)
    if (!masterData.accessories) {
      setError("Accessory not found!");
      return;
    }

    const accessory = masterData.accessories.find(
      (acc) =>
        acc.RefClient && acc.RefClient.toUpperCase() === code.toUpperCase()
    );

    if (accessory) {
      const accessoryId = constructAccessoryId(accessory);
      navigate(`/accessory/${accessoryId}`);
    } else {
      setError("Invalid code. Unable to find this item!");
    }
  };
  //#endregion

  return { handleScan, error, clearError };
};
