import { Image, ImageOff } from "lucide-react";
import React from "react";

interface Props {
  showImages: boolean;
  setShowImages: (show: boolean) => void;
  isLegacyMode?: boolean;
}

function ImageToggleBtn({
  showImages,
  setShowImages,
  isLegacyMode = false,
}: Props) {
  if (isLegacyMode) return null;

  return (
    <button
      onClick={() => setShowImages(!showImages)}
      className={`w-40 hidden sm:flex px-4 py-2 items-center gap-2 rounded-lg border transition-all duration-200 text-sm font-medium h-[42px] sm:h-auto ${
        !showImages ? "toggle-btn-on-blue" : "toggle-btn-off"
      }`}
    >
      {!showImages ? (
        <>
          <Image className="w-4 h-4" />
          <span>Photos: Show</span>
        </>
      ) : (
        <>
          <ImageOff className="w-4 h-4" />
          <span>Photos: Hide</span>
        </>
      )}
    </button>
  );
}

export default ImageToggleBtn;
