import React from "react";
import { Package, ExternalLink, AlertCircle } from "lucide-react";
import { ROUTES } from "../../AppRoutes";
import MetaItem from "./MetaItem";

interface LinkedConnectorProps {
  connector: any;
  onClose: () => void;
}

export const LinkedConnector: React.FC<LinkedConnectorProps> = ({
  connector,
  onClose,
}) => {
  if (!connector) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-slate-500" />
        <p className="text-slate-400 text-sm">
          No related connector found in stock system.
        </p>
      </div>
    );
  }

  const handleNavigate = () => {
    window.open(
      `${ROUTES.CONNECTORS}/${connector.CODIVMAC}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  };

  const details = connector.Connectors_Details || {};
  const { CODIVMAC, Vias, Qty } = connector;
  const { Designa__o, Fabricante } = details;

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <Package size={18} />
            <span>Related Connector</span>
            {!Qty && (
              <span className="text-sm text-amber-400 text-center font-medium">
                (out of stock)
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-2 text-sm break-all">
            <MetaItem label="CODIVMAC" value={CODIVMAC}></MetaItem>
            <MetaItem label="Current Stock" value={Qty + " units"}></MetaItem>
            <MetaItem label="Description" value={Designa__o}></MetaItem>
            <MetaItem label="Manufacturer" value={Fabricante}></MetaItem>
            <MetaItem label="Vias" value={Vias}></MetaItem>
          </div>
        </div>

        <button
          onClick={handleNavigate}
          className="ml-4 p-2.5 bg-blue-600 hover:bg-blue-50 text-white hover:text-blue-600 rounded-lg transition-all shadow-lg shadow-blue-600/20"
          title="View Connector Details"
        >
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};
