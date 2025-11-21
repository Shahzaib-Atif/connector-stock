import { Connector } from "@/types";

interface Props {
  liveStock: number;
  conn: Connector;
}

function ConnectorInfo({ liveStock, conn }: Props) {
  return (
    <>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border ${
          liveStock > 0
            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}
      >
        {conn.viasCode}
      </div>
      <div>
        <div className="font-mono font-bold text-white text-lg">{conn.id}</div>
        <div className="text-sm text-slate-400">
          {conn.colorName} • {conn.viasName}
        </div>
      </div>
    </>
  );
}

export default ConnectorInfo;
