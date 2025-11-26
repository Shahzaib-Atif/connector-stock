import { Wrench } from "lucide-react";

interface Props {
  imageUrl: string;
  error: boolean;
  handleError: () => void;
}

function AccessoryImage({ imageUrl, error, handleError }: Props) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-sm aspect-video bg-slate-900/80 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <img
          src={imageUrl}
          className="w-full h-full object-contain"
          onError={handleError}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
            <div className="text-center text-slate-500">
              <Wrench className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessoryImage;
