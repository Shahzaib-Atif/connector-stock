import { Image, ImageOff } from "lucide-react";
import React from "react";

interface Props {
  showImages: boolean;
  isLegacyMode: boolean;
  setShowImages: (show: boolean) => void;
}

function ImageToggleBtn({ showImages, isLegacyMode, setShowImages }: Props) {
  return (
    !isLegacyMode && (
      <button
        onClick={() => setShowImages(!showImages)}
        className={`w-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium h-[42px] sm:h-auto ${
          showImages
            ? "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
        }`}
      >
        {showImages ? (
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
    )
  );
}

export default ImageToggleBtn;
