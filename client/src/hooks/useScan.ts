import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { getBoxDetails, parseConnector } from "../services/connectorService";

export const useScan = () => {
  const navigate = useNavigate();
  const { masterData } = useAppSelector((state) => state.stock);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (inputCode: string) => {
    setError(null); // Clear previous errors

    if (!masterData) {
      console.warn("Master data not loaded yet");
      return;
    }

    const code = inputCode.trim();
    const upperCode = code.toUpperCase();

    if (code.length === 6) handleConnectorNav(upperCode);
    else if (code.length === 4) handleBoxNav(upperCode);
    else handleInvalidEntry();
  };

  const clearError = () => setError(null);

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

  const handleInvalidEntry = () => {
    setError(
      "Invalid Code. Box ID (4 chars) or Connector ID (6 chars) expected."
    );
  };

  return { handleScan, error, clearError };
};
