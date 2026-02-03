import { Box } from "@/utils/types";
import { MapPin } from "lucide-react";
import CoordinateRow from "./CoordinateRow";

interface Props {
  box: Box;
}

function BoxCoordinatesCard({ box }: Props) {
  return (
    <div
      id="box-coordinates-card"
      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase">
            Physical Coordinates
          </div>

          {/* Coordinates */}
          <div className="flex flex-col gap-1 mt-1">
            {(box.cv || box.ch) && (
              <CoordinateRow label="PT" cv={box.cv} ch={box.ch} />
            )}
            {(box.cv_ma || box.ch_ma) && (
              <CoordinateRow label="MA" cv={box.cv_ma} ch={box.ch_ma} />
            )}
          </div>
        </div>
      </div>

      {/* total items */}
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
