import { useState } from "react";
import { ConnectorExtended } from "@/utils/types";
import { API } from "@/utils/api";
import { getColorFromColorMap } from "@/utils/colorMap";

interface Props {
  liveStock: number;
  conn: ConnectorExtended;
}

function ConnectorInfo({ liveStock, conn }: Props) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = API.connectorImages(conn.CODIVMAC, conn.ConnType ?? "");

  return (
    <>
      {!imageError ? (
        <img
          src={imageUrl}
          alt={conn.CODIVMAC}
          className={`w-12 h-12 rounded-lg object-cover border ${
            liveStock > 0 ? "border-blue-500/20" : "border-red-500/20"
          }`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border ${
            liveStock > 0
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        />
      )}
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-white text-base tracking-tight">
          {conn.CODIVMAC}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-700/50">
            {conn.ConnType}
          </span>

          <div className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{
                background: getColorFromColorMap(conn.Cor),
              }}
            />
            {conn.colorNamePT}
          </div>
        </div>
      </div>
    </>
  );
}

export default ConnectorInfo;
