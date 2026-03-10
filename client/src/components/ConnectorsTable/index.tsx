import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useConnectorFilters } from "@/hooks/useConnectorFilters";
import { DetailHeader } from "../common/DetailHeader";
import { ConnectorsTable } from "./ConnectorsTable";
import { ConnectorsFilterBar } from "./ConnectorsFilterBar";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { Connector } from "@/utils/types";
import { useImageToggle } from "./ConnectorsTable/useImageToggle ";
import { useLegacyData } from "./ConnectorsTable/useLegacyData";
import LegacyToggleBtn from "./ConnectorsTable/LegacyToggleBtn";
import ImageToggleBtn from "./ConnectorsTable/ImageToggleBtn";

export const ConnectorsListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData,
  );

  // Photo visibility state with persistence
  const { showImages, setShowImages } = useImageToggle();

  // Legacy data handling
  const { isLegacyMode, setIsLegacyMode, legacyData, legacyLoading } =
    useLegacyData();

  // Get connectors from masterData or legacy data
  const connectors = isLegacyMode ? legacyData : (masterData?.connectors ?? {});

  // Custom hook for filters
  const {
    filters,
    setIdQuery,
    setType,
    setFabricante,
    setFamily,
    setVias,
    setColor,
    setInternalDiameter,
    setExternalDiameter,
    setThickness,
    filteredConnectors,
    clearFilters,
    typeOptions,
    fabricanteOptions,
    viasOptions,
    colorOptions,
  } = useConnectorFilters(connectors);

  const {
    paginatedItems: paginatedConnectors,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredConnectors, initialItemsPerPage: 25 });

  // Reset page when filters or mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, isLegacyMode]);

  // Show spinner only when loading
  if (loading && !masterData) {
    return <Spinner />;
  }

  if (legacyLoading) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label={isLegacyMode ? "Legacy Connectors" : "Connectors"}
        title={isLegacyMode ? "Old References" : "All Connectors"}
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="connectors-content" className="table-view-content">
        <div className="table-view-inner-content">
          <ConnectorsFilterBar
            idQuery={filters.idQuery}
            onIdQueryChange={setIdQuery}
            type={filters.type}
            onTypeChange={setType}
            typeOptions={typeOptions}
            fabricante={filters.fabricante}
            onFabricanteChange={setFabricante}
            fabricanteOptions={fabricanteOptions}
            family={filters.family}
            onFamilyChange={setFamily}
            vias={filters.vias}
            onViasChange={setVias}
            viasOptions={viasOptions}
            color={filters.color}
            onColorChange={setColor}
            colorOptions={colorOptions}
            internalDiameter={filters.internalDiameter}
            onInternalDiameterChange={setInternalDiameter}
            externalDiameter={filters.externalDiameter}
            onExternalDiameterChange={setExternalDiameter}
            thickness={filters.thickness}
            onThicknessChange={setThickness}
            onClearFilters={clearFilters}
          >
            {/* Toggle Buttons */}
            <div className="flex items-center gap-2">
              <ImageToggleBtn
                showImages={showImages}
                isLegacyMode={isLegacyMode}
                setShowImages={setShowImages}
              />{" "}
              <LegacyToggleBtn
                isLegacyMode={isLegacyMode}
                setIsLegacyMode={setIsLegacyMode}
              />
            </div>
          </ConnectorsFilterBar>

          <div className="table-container-outer">
            <ConnectorsTable
              connectors={paginatedConnectors as Connector[]}
              showImages={showImages && !isLegacyMode}
              isLegacyMode={isLegacyMode}
            />
          </div>

          {/* Pagination */}
          {filteredConnectors.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredConnectors.length}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
