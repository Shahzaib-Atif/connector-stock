interface Props {
  src: string;
  selectedImage: string;
  setSelectedImage: (value: React.SetStateAction<string | null>) => void;
}

function LightBoxOverlay({ src, selectedImage, setSelectedImage }: Props) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setSelectedImage(null)}
    >
      {/* Close Button – fixed to viewport */}
      <button
        className="fixed top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-md"
        onClick={() => setSelectedImage(null)}
      >
        Close
      </button>

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
