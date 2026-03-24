import React from "react";
import InfoBadge from "./InfoBadge";

interface ParsedInfoProps {
  conector: string;
  encomenda: string;
  prodId: string;
  senderUser: string;
  senderSector: string;
  wireType?: string;
  sample?: string;
}

export const ParsedInfo: React.FC<ParsedInfoProps> = ({
  conector,
  encomenda,
  prodId,
  senderUser,
  senderSector,
  wireType,
  sample,
}) => {
  if (!conector) return null;
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
      <p className="text-xs text-slate-500 uppercase tracking-wider">
        Requested Items - from {senderUser} ({senderSector})
      </p>
      <div className="flex flex-wrap gap-3">
        <InfoBadge title="Connector" text={conector} />
        {encomenda && <InfoBadge title="Order" text={encomenda} />}
        {prodId && <InfoBadge title="Prod Id" text={prodId} />}
        {wireType && <InfoBadge title="" text={wireType ?? "Yes"} />}
        {sample && <InfoBadge title="Sample" text={sample} />}
      </div>
    </div>
  );
};
