import { Box } from "@/types";
import { MapPin } from "lucide-react";

interface Props {
  box: Box;
}

function BoxCoordinatesCard({ box }: Props) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase">
            Physical Coordinates
          </div>
          <div className="font-mono font-bold text-white text-base sm:text-lg">
            {box.cv} <span className="text-slate-600">/</span> {box.ch}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">
          {box.connectors.length + box.accessories.length}
        </div>
        <div className="text-xs text-slate-500">Total Items</div>
      </div>
    </div>
  );
}

export default BoxCoordinatesCard;
