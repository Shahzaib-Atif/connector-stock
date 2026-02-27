import React, { useEffect, useState } from "react";
import { Images, Loader2, Maximize2 } from "lucide-react";
import { fetchRelatedAccessoryImages } from "../../../api/relatedAccessoryImagesApi";
import { API } from "../../../utils/api";
import { CollapsibleSection } from "../../common/CollapsibleSection";
import LightBoxOverlay from "@/components/common/LightBoxOverlay";

interface RelatedAccessoryImagesProps {
  accessoryId: string;
}

export const RelatedAccessoryImages: React.FC<RelatedAccessoryImagesProps> = ({
  accessoryId,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const data = await fetchRelatedAccessoryImages(
          accessoryId?.split("_")[0] || "",
        );
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch related accessory images:", err);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [accessoryId]);

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
              src={API.accessoryExtrasImage(filename)}
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
        <LightBoxOverlay
          src={API.accessoryExtrasImage(selectedImage)}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </CollapsibleSection>
  );
};
