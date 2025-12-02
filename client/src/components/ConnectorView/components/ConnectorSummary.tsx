import React, { useEffect, useRef, useState } from "react";
import { MapPin, Users } from "lucide-react";
import { Connector } from "../../../types";
import { API } from "@/utils/api";
import ImageBox from "@/components/common/ImageBox";
import StockDiv from "@/components/common/StockDiv";
import CardInfoDiv from "@/components/common/CardInfoDiv";
import ClientReference from "@/components/common/ClientReference";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";

interface ConnectorSummaryProps {
  connector: Connector;
  currentStock: number;
}

export const ConnectorSummary: React.FC<ConnectorSummaryProps> = ({
  connector,
  currentStock,
}) => {
  const [error, setError] = useState(false);
  const imageUrl = API.connectorImages(connector.id);

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
        <StockDiv currentStock={currentStock} />
        <div id="connector-position" className="flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs sm:text-sm font-bold border border-blue-500/20">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            {connector.cv} | {connector.ch}
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 font-mono">
            POS: {connector.posId}
          </div>
        </div>
      </div>
      {/* Color, Vias & Type */}
      <div
        id="connector-metadata"
        className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Color" value={connector.colorName} />
        <CardInfoDiv label="Vias" value={connector.viasName} />
        <CardInfoDiv label="Type" value={connector.type} />
        <CardInfoDiv label="Fabricante" value={connector.fabricante} />
      </div>
    </div>
  );
};
