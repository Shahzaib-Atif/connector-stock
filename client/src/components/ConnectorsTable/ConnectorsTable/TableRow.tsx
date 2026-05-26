import React, { useMemo, useState } from "react";
import { API } from "@/utils/api";
import { ROUTES } from "@/components/AppRoutes";
import { ConnectorExtended } from "@/utils/types";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";
import { getViasValue } from "@/utils/functions/connector";
import { useAppSelector } from "@/store/hooks";
import { UserRoles } from "@shared/enums/UserRoles";
import { updateLegacyConnectorType } from "@/api/legacyApi";

interface TableRowProps {
  connector: ConnectorExtended;
  showImages?: boolean;
  isLegacyMode?: boolean;
  onLegacyConnectorUpdated?: (
    connectorId: string,
    connectorPatch: Partial<ConnectorExtended>,
  ) => void;
}

const hasMissingType = (value?: string | null) => {
  const normalized = value?.trim() ?? "";
  return !normalized || normalized === "-" || normalized === "--";
};

const TableRow: React.FC<TableRowProps> = ({
  connector,
  showImages = false,
  isLegacyMode = false,
  onLegacyConnectorUpdated,
}) => {
  const { role, user } = useAppSelector((state) => state.auth);
  const connectorTypes =
    useAppSelector((state) => state.masterData.data?.connectorTypes) ?? [];

  const [selectedType, setSelectedType] = useState("");
  const [isSavingType, setIsSavingType] = useState(false);
  const [saveError, setSaveError] = useState("");

  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;
  const canAssignLegacyType =
    isLegacyMode && isAdmin && hasMissingType(connector.ConnType);

  const availableTypes = useMemo(
    () =>
      connectorTypes.filter(
        (type, index, all) => type?.trim() && all.indexOf(type) === index,
      ),
    [connectorTypes],
  );

  const getLink = (id: string, type: "box" | "connector") => {
    const route = type === "connector" ? ROUTES.CONNECTORS : ROUTES.BOXES;
    return `${route}/${id}`;
  };

  const imageUrl = API.connectorImages(
    connector.CODIVMAC,
    connector.ConnType ?? "",
  );

  const isOlhal =
    connector.ConnType?.toLowerCase().trim() === "olhal" ||
    connector.ConnType?.toLowerCase().includes("olhal");

  const hasDimensions =
    isOlhal &&
    !!connector.dimensions &&
    (connector.dimensions.InternalDiameter != null ||
      connector.dimensions.ExternalDiameter != null ||
      connector.dimensions.Thickness != null);

  const handleSaveType = async () => {
    if (!selectedType || isSavingType) return;

    setIsSavingType(true);
    setSaveError("");

    try {
      await updateLegacyConnectorType(connector.CODIVMAC, selectedType, user);

      onLegacyConnectorUpdated?.(connector.CODIVMAC, {
        ConnType: selectedType,
      });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to update connector type",
      );
    } finally {
      setIsSavingType(false);
    }
  };

  return (
    <tr className={"table-row table-row-bg"} key={connector.CODIVMAC}>
      {showImages && (
        <td className="table-data py-2 px-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={imageUrl}
              alt={connector.CODIVMAC}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = "/fallback.png";
              }}
            />
          </div>
        </td>
      )}
      <td className="table-data">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span>{connector.CODIVMAC}</span>
          {!isLegacyMode && (
            <Link
              to={getLink(connector.CODIVMAC, "connector")}
              className="link-icon p-1"
            >
              <LinkIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </td>

      <td className="table-data">
        <div className="flex items-center gap-1">
          <span>{connector.PosId}</span>
          {connector.PosId && (
            <Link
              to={getLink(connector.PosId, "box")}
              className="link-icon p-1"
            >
              <LinkIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </td>

      <td className="table-data">{connector.Cor}</td>
      <td className="table-data">{getViasValue(connector)}</td>
      <td className="table-data">
        {canAssignLegacyType ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="min-w-32 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSaveType}
                disabled={!selectedType || isSavingType}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingType ? "Saving..." : "Save"}
              </button>
            </div>
            {saveError && (
              <span className="text-xs text-red-300">{saveError}</span>
            )}
          </div>
        ) : (
          connector.ConnType
        )}
      </td>
      {!isLegacyMode && (
        <td className="table-data">{connector.details?.Family}</td>
      )}
      <td className="table-data">{connector.details?.Fabricante}</td>
      <td className="table-data break-all">
        {connector.details?.Refabricante}
      </td>

      {!isLegacyMode && (
        <td className="table-data align-top">
          {hasDimensions ? (
            <div className="flex flex-col text-xs text-slate-300 leading-tight">
              {connector.dimensions?.InternalDiameter != null && (
                <span>Int Ø: {connector.dimensions.InternalDiameter}</span>
              )}
              {connector.dimensions?.ExternalDiameter != null && (
                <span>Ext Ø: {connector.dimensions.ExternalDiameter}</span>
              )}
              {connector.dimensions?.Thickness != null && (
                <span>Thick: {connector.dimensions.Thickness}</span>
              )}
            </div>
          ) : null}
        </td>
      )}
      {/* Total */}
      {!isLegacyMode && (
        <td className="table-data text-center">
          <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {connector.Qty ?? 0}
          </span>
        </td>
      )}
      {/* CF */}
      {!isLegacyMode && (
        <td className="table-data text-center">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 group">
              <div className="w-1 h-1 rounded-full bg-blue-400 opacity-60" />
              <span className="text-slate-400 text-sm font-mono">
                {connector.Qty_com_fio ?? 0}
              </span>
            </div>
          </div>
        </td>
      )}
      {/* SF */}
      {!isLegacyMode && (
        <td className="table-data text-center">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 group">
              <div className="w-1 h-1 rounded-full bg-slate-500 opacity-60" />
              <span className="text-slate-500 text-sm font-mono">
                {connector.Qty_sem_fio ?? 0}
              </span>
            </div>
          </div>
        </td>
      )}
      <td className="table-data break-all">{connector.details?.OBS}</td>
    </tr>
  );
};

export default TableRow;
