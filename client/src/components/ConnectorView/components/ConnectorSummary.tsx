import React, { useState } from "react";
import { API } from "@/utils/api";
import ImageBox from "@/components/common/ImageBox";
import StockDiv from "@/components/common/StockDiv";
import CardInfoDiv from "@/components/common/CardInfoDiv";
import { VIEW_SUMMARY_CLASS } from "@/utils/constants";
import { ConnectorExtended } from "@/utils/types";
import { getViasValue } from "@/services/connectorService";
import ClientReferences from "./ClientReferences";
import Coordinates from "./Coordinates";

interface Props {
  connector: ConnectorExtended;
}

export const ConnectorSummary: React.FC<Props> = ({ connector }) => {
  const [error, setError] = useState(false);
  const imageUrl = API.connectorImages(
    connector.CODIVMAC,
    connector.ConnType ?? "",
  );
  const { PosId, colorName, Qty, ConnType, details, dimensions } = connector;

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
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4"
      >
        <CardInfoDiv label="Color" value={colorName ?? ""} />
        <CardInfoDiv label="Vias" value={getViasValue(connector)} />
        <CardInfoDiv label="Type" value={ConnType ?? ""} />
        <CardInfoDiv
          label="Family"
          value={details?.Family?.toString() || "-"}
        />

        {/* Fabricante, Refabricante, Obs */}
        <CardInfoDiv
          label="Fabricante"
          value={details?.Fabricante || "--"}
          classnames="col-start-1"
        />
        <CardInfoDiv
          label="Refabricante"
          value={details?.Refabricante || "--"}
        />
        {details?.OBS && (
          <CardInfoDiv label="Obs." value={details?.OBS || "-"} />
        )}

        {/* Dimensions */}
        {hasDimensions && (
          <>
            <CardInfoDiv
              label="Internal Ø (mm)"
              value={
                dimensions?.InternalDiameter != null
                  ? dimensions.InternalDiameter.toString()
                  : "-"
              }
              classnames="col-start-1"
            />
            <CardInfoDiv
              label="External Ø (mm)"
              value={
                dimensions?.ExternalDiameter != null
                  ? dimensions.ExternalDiameter.toString()
                  : "-"
              }
            />
            <CardInfoDiv
              label="Thickness (mm)"
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
