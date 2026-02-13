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
  const { PosId, colorName, Qty, ConnType, details, dimensions } = connector;
  const { Fabricante, Refabricante, Family, OBS } = details;

  const hasDimensions =
    !!dimensions &&
    (dimensions.InternalDiameter != null ||
      dimensions.ExternalDiameter != null ||
      dimensions.Thickness != null);

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
        <CardInfoDiv label="Color" value={colorName ?? ""} />
        <CardInfoDiv label="Vias" value={getViasValue(connector)} />
        <CardInfoDiv label="Type" value={ConnType ?? ""} />
        <CardInfoDiv label="Family" value={Family?.toString() || "-"} />

        {/* Fabricante, Refabricante, Obs */}
        <CardInfoDiv
          label="Fabricante"
          value={Fabricante || "--"}
          classnames="col-start-1"
        />
        <CardInfoDiv label="Refabricante" value={Refabricante || "--"} />
        {OBS && <CardInfoDiv label="Obs." value={OBS || "-"} />}

        {/* Dimensions */}
        {hasDimensions && (
          <>
            <CardInfoDiv
              label="Internal Ø"
              value={
                dimensions?.InternalDiameter != null
                  ? dimensions.InternalDiameter.toString()
                  : "-"
              }
              classnames="col-start-1"
            />
            <CardInfoDiv
              label="External Ø"
              value={
                dimensions?.ExternalDiameter != null
                  ? dimensions.ExternalDiameter.toString()
                  : "-"
              }
            />
            <CardInfoDiv
              label="Thickness"
              value={
                dimensions?.Thickness != null
                  ? dimensions.Thickness.toString()
                  : "-"
              }
            />
          </>
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
  if (connector.details.ActualViaCount)
    return `${connector.Vias} (${connector.details.ActualViaCount})`;
  return `${connector.Vias} (${connector.viasName})`;
}
