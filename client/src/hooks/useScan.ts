import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { parseAccessory, getBoxDetails } from "../services/connectorService";

export const useScan = () => {
  const navigate = useNavigate();
  const { stockCache } = useAppSelector((state) => state.stock);

  const handleScan = (inputCode: string) => {
    const code = inputCode.trim();
    const upperCode = code.toUpperCase();

    if (/^\d+$/.test(code)) {
      const ref = parseInt(code, 10);
      if (code.length >= 3) {
        navigate(`/search?q=${code}`);
        return;
      }
    }

    if (code.includes("_")) {
      const acc = parseAccessory(code, stockCache);
      navigate(`/accessory/${acc.id}`);
    } else if (code.length === 6) {
      navigate(`/connector/${upperCode}`);
    } else if (code.length === 4) {
      const box = getBoxDetails(upperCode);
      if (box) {
        navigate(`/box/${upperCode}`);
      } else {
        alert("Box not found");
      }
    } else {
      alert(
        "Invalid Code. Box ID (4 chars), Connector ID (6 chars), Accessory ID (Conn_Ref), or Client Ref (Numeric) expected."
      );
    }
  };

  return { handleScan };
};
