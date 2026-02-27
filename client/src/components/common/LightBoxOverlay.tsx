import React, { useEffect } from "react";

interface Props {
  images: string[];
  selectedImage: string;
  setSelectedImage: (value: React.SetStateAction<string | null>) => void;
  getSrc: (filename: string) => string;
}

function LightBoxOverlay({
  images,
  selectedImage,
  setSelectedImage,
  getSrc,
}: Props) {
  const currentIndex = images.findIndex((img) => img === selectedImage);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < images.length - 1;

  const onPrev = () => {
    if (!hasPrev) return;
    setSelectedImage(images[currentIndex - 1]);
  };

  const onNext = () => {
    if (!hasNext) return;
    setSelectedImage(images[currentIndex + 1]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      } else if (event.key === "ArrowLeft" && hasPrev) {
        event.preventDefault();
        onPrev();
      } else if (event.key === "ArrowRight" && hasNext) {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, currentIndex, images, setSelectedImage]);

  const src = getSrc(selectedImage);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setSelectedImage(null)}
    >
      {/* Close Button – fixed to viewport */}
      <button
        type="button"
        className="fixed top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-md"
        onClick={() => setSelectedImage(null)}
      >
        Close
      </button>

      {/* Navigation Arrows – fixed to viewport */}
      {hasPrev && (
        <button
          type="button"
          className="fixed left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-md"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          ◀
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          className="fixed right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-md"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          ▶
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-[95vw] max-h-[90vh] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()} // Prevent overlay close when clicking image
      >
        <img
          src={src}
          alt={selectedImage}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />

        <p className="text-slate-400 font-mono text-sm text-center break-all">
          {selectedImage}
        </p>
      </div>
    </div>
  );
}

export default LightBoxOverlay;
