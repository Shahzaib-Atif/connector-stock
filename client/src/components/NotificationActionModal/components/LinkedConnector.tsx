import React from "react";
import { Package, ExternalLink, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../AppRoutes";

interface LinkedConnectorProps {
  connector: any;
  onClose: () => void;
}

export const LinkedConnector: React.FC<LinkedConnectorProps> = ({
  connector,
  onClose,
}) => {
  const navigate = useNavigate();

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
    navigate(`${ROUTES.CONNECTORS}/${connector.CODIVMAC}`);
    onClose();
  };

  const details = connector.Connectors_Details || {};

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <Package size={18} />
            <span>Related Connector</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                Reference
              </p>
              <p className="text-white font-mono font-medium">
                {connector.CODIVMAC}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                Current Stock
              </p>
              <p
                className={`font-bold ${
                  connector.Qty > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {connector.Qty} units
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                Description
              </p>
              <p className="text-slate-300">{details.Designa__o || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                Manufacturer
              </p>
              <p className="text-slate-300">{details.Fabricante || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                Vias
              </p>
              <p className="text-slate-300">{connector.Vias}</p>
            </div>
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
