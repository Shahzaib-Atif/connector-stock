import React, { useState } from "react";
import { MapPin, Users } from "lucide-react";
import { API } from "@/utils/api";
import ImageBox from "@/components/common/ImageBox";
import StockDiv from "@/components/common/StockDiv";
import CardInfoDiv from "@/components/common/CardInfoDiv";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";
import { Connector } from "@/utils/types";

interface ConnectorSummaryProps {
  connector: Connector;
}

export const ConnectorSummary: React.FC<ConnectorSummaryProps> = ({
  connector,
}) => {
  const [error, setError] = useState(false);
  const imageUrl = API.connectorImages(connector.CODIVMAC);

  return (
    <div id="connector-summary" className={VIEW_SUMMARY_CLASS}>
      {/* Connector Image (if available) */}
      <ImageBox
        error={error}
        imageUrl={imageUrl}
        handleError={() => setError(true)}
      />
      {/* Stock Header */}
      <div className="flex justify-between items-start">
        <StockDiv currentStock={connector.Qty} />
        <div id="connector-position" className="flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs sm:text-sm font-bold border border-blue-500/20">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            {connector.cv} | {connector.ch}
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 font-mono">
            POS: {connector.PosId}
          </div>
        </div>
      </div>
      {/* Color, Vias, Type, Family */}
      <div
        id="connector-metadata-1"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Color" value={connector.colorName} />
        <CardInfoDiv label="Vias" value={connector.viasName} />
        <CardInfoDiv label="Type" value={connector.ConnType} />
        <CardInfoDiv
          label="Family"
          value={connector.details.Family?.toString() || "-"}
        />
      </div>
      {/* Color, Vias, Type, Family */}
      <div
        id="connector-metadata-2"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Fabricante" value={connector.details.Fabricante} />
        <CardInfoDiv
          label="Refabricante"
          value={connector.details.Refabricante}
        />
        <CardInfoDiv
          classnames="col-span-2"
          label="Obs."
          value={connector.details.OBS}
        />
      </div>

      {/* Client References */}
      {connector.clientReferences && connector.clientReferences.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              RefMARCA
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {connector.clientReferences.map((ref, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 font-medium"
              >
                {ref}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
