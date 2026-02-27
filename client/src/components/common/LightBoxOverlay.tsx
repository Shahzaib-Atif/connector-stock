interface Props {
  src: string;
  selectedImage: string;
  setSelectedImage: (value: React.SetStateAction<string | null>) => void;
}

function LightBoxOverlay({ src, selectedImage, setSelectedImage }: Props) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={() => setSelectedImage(null)}
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4">
        <img
          src={src}
          alt={selectedImage}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        />
        <p className="text-slate-400 font-mono text-sm">{selectedImage}</p>
        <button
          className="absolute top-0 right-0 -translate-y-12 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          onClick={() => setSelectedImage(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LightBoxOverlay;
