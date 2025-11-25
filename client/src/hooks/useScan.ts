import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { getBoxDetails } from "../services/connectorService";

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

    if (code.length === 6) {
      navigate(`/connector/${upperCode}`);
    } else if (code.length === 4) {
      const box = getBoxDetails(upperCode, masterData);
      if (box) {
        navigate(`/box/${upperCode}`);
      } else {
        setError("Box not found");
      }
    } else {
      setError("Invalid Code. Box ID (4 chars) or Connector ID (6 chars) expected.");
    }
  };

  const clearError = () => setError(null);

  return { handleScan, error, clearError };
};
