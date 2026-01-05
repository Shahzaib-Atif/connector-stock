import React, { useEffect, useState } from "react";
import { Images, Loader2, Maximize2 } from "lucide-react";
import { fetchRelatedImages } from "../../../api/relatedImagesApi";
import { API } from "../../../utils/api";
import { CollapsibleSection } from "../../common/CollapsibleSection";

interface RelatedImagesProps {
  connectorId: string;
}

export const RelatedImages: React.FC<RelatedImagesProps> = ({
  connectorId,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const data = await fetchRelatedImages(connectorId);
        setImages(data);
      } catch (err: any) {
        console.error("Failed to fetch related images:", err);
        setError("Could not load related images");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [connectorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <CollapsibleSection
      title="Related Images"
      icon={<Images className="w-4 h-4" />}
      count={images.length}
      defaultOpen={false}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((filename) => (
          <div
            key={filename}
            className="group relative aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg"
            onClick={() => setSelectedImage(filename)}
          >
            <img
              src={API.extrasImage(filename)}
              alt={filename}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] text-slate-300 truncate font-mono">
                {filename}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4">
            <img
              src={API.extrasImage(selectedImage)}
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
      )}
    </CollapsibleSection>
  );
};
