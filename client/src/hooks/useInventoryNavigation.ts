import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Shared nav helpers keep route building centralized.
export const useInventoryNavigation = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goToConnector = useCallback(
    (connectorId: string) => navigate(`/connector/${connectorId}`),
    [navigate]
  );
  const goToAccessory = useCallback(
    (accessoryId: string) => navigate(`/accessory/${accessoryId}`),
    [navigate]
  );
  const goToBox = useCallback(
    (boxId: string) => navigate(`/box/${boxId}`),
    [navigate]
  );
  const goToClientRef = useCallback(
    (clientRef: number | string) => navigate(`/search?q=${clientRef}`),
    [navigate]
  );

  return { goBack, goToConnector, goToAccessory, goToBox, goToClientRef };
};

