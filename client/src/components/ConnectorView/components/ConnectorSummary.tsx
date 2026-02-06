import React, { useState } from "react";
import { API } from "@/utils/api";
import ImageBox from "@/components/common/ImageBox";
import StockDiv from "@/components/common/StockDiv";
import CardInfoDiv from "@/components/common/CardInfoDiv";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";
import { Connector } from "@/utils/types";
import ClientReferences from "./ClientReferences";
import Coordinates from "./Coordinates";

interface ConnectorSummaryProps {
  connector: Connector;
}

export const ConnectorSummary: React.FC<ConnectorSummaryProps> = ({
  connector,
}) => {
  const [error, setError] = useState(false);
  const imageUrl = API.connectorImages(connector.CODIVMAC);
  const { PosId, colorName, Qty, ConnType, details } = connector;
  const { Fabricante, Refabricante, Family, OBS } = details;

  return (
    <div id="connector-summary" className={VIEW_SUMMARY_CLASS}>
      {/* Connector Image (if available) */}
      <ImageBox
        error={error}
        imageUrl={imageUrl}
        handleError={() => setError(true)}
      />
      {/* Stock Header */}
      <div className="flex justify-between items-start mb-6">
        <StockDiv currentStock={Qty || 0} connector={connector} />
        <Coordinates PosId={PosId} connector={connector} />
      </div>

      {/* Color, Vias, Type, Family */}
      <div
        id="connector-metadata-1"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Color" value={colorName} />
        <CardInfoDiv label="Vias" value={getViasValue(connector)} />
        <CardInfoDiv label="Type" value={ConnType} />
        <CardInfoDiv label="Family" value={Family?.toString() || "-"} />
      </div>

      {/* Fabricante, Refabricante, Obs */}
      <div
        id="connector-metadata-2"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
      >
        <CardInfoDiv label="Fabricante" value={Fabricante || "--"} />
        <CardInfoDiv label="Refabricante" value={Refabricante || "--"} />
        {OBS && (
          <CardInfoDiv
            classnames="col-span-2"
            label="Obs."
            value={OBS || "-"}
          />
        )}
      </div>

      {/* Client References */}
      {connector.clientReferences && connector.clientReferences.length > 0 && (
        <ClientReferences clientReferences={connector.clientReferences} />
      )}
    </div>
  );
};

function getViasValue(connector: Connector) {
  console.log(connector.CODIVMAC, connector.details.ActualViaCount);

  if (connector.details.ActualViaCount)
    return `${connector.Vias} (${connector.details.ActualViaCount})`;
  return `${connector.Vias} (${connector.viasName})`;
}
