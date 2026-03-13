import { Database, History } from "lucide-react";
import React from "react";

interface Props {
  isLegacyMode: boolean;
  setIsLegacyMode: (value: React.SetStateAction<boolean>) => void;
}

function LegacyToggleBtn({ isLegacyMode, setIsLegacyMode }: Props) {
  return (
    <button
      onClick={() => setIsLegacyMode(!isLegacyMode)}
      className={`flex-row px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium h-[42px] sm:h-auto ${
        isLegacyMode ? "toggle-btn-on-amber" : "toggle-btn-off"
      }`}
      title={isLegacyMode ? "Switch to Live Data" : "Switch to Legacy Data"}
    >
      {isLegacyMode ? (
        <>
          <Database className="w-4 h-4" />
          <span>View Live</span>
        </>
      ) : (
        <>
          <History className="w-4 h-4" />
          <span>View Legacy</span>
        </>
      )}
    </button>
  );
}

export default LegacyToggleBtn;
