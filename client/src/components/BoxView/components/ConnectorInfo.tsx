import { useState } from "react";
import { Connector } from "@/types";

interface Props {
  liveStock: number;
  conn: Connector;
}

function ConnectorInfo({ liveStock, conn }: Props) {
  const [imageError, setImageError] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const imageUrl = `${API_BASE_URL}/images/${conn.id}`;

  return (
    <>
      {!imageError ? (
        <img
          src={imageUrl}
          alt={conn.id}
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
      <div>
        <div className="font-mono font-bold text-white text-lg">{conn.id}</div>
        <div className="text-sm text-slate-400">
          {conn.colorNamePT} • {conn.viasName}
        </div>
      </div>
    </>
  );
}

export default ConnectorInfo;
