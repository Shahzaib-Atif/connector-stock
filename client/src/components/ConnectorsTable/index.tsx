import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useConnectorFilters } from "@/components/ConnectorsTable/useConnectorFilters";
import { DetailHeader } from "../common/DetailHeader";
import { ConnectorsTable } from "./ConnectorsTable";
import { ConnectorsFilterBar } from "./ConnectorsFilterBar";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { ConnectorExtended } from "@/utils/types";
import { useImageToggle } from "@/hooks/useImageToggle";
import { useLegacyData } from "./ConnectorsTable/useLegacyData";
import { getActiveFilterCount } from "./constants";
import LegacyToggleBtn from "./ConnectorsTable/LegacyToggleBtn";
import ImageToggleBtn from "../common/ImageToggleBtn";
import { useFiltersToggle } from "../../hooks/useFiltersToggle";
import { STORAGE_KEYS } from "@/utils/constants";
import { Plus } from "lucide-react";
import { UserRoles } from "@shared/enums/UserRoles";
import { ModalWrapper } from "../common/ModalWrapper";
import { ConnectorCreateForm } from "./components/ConnectorCreateForm";

export const ConnectorsListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData,
  );
  const { role, user } = useAppSelector((state) => state.auth);
  const isEditAllowed = role === UserRoles.Master || user === "admin1";
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Photo visibility state with persistence
  const { showImages, setShowImages } = useImageToggle(
    STORAGE_KEYS.CONNECTORS_SHOW_IMAGES,
  );

  // Legacy data handling
  const {
    isLegacyMode,
    setIsLegacyMode,
    legacyData,
    legacyLoading,
    updateLegacyConnector,
  } = useLegacyData();

  // Get connectors from masterData or legacy data
  const connectors = isLegacyMode ? legacyData : (masterData?.connectors ?? {});

  // Custom hook for filters
  const {
    filters,
    setFilterField,
    filteredConnectors,
    clearFilters,
    typeOptions,
    fabricanteOptions,
    colorOptions,
  } = useConnectorFilters(connectors, isLegacyMode ? null : masterData);

  const activeFiltersCount = getActiveFilterCount(filters);
  const { showFilters, setShowFilters } = useFiltersToggle(
    STORAGE_KEYS.CONNECTORS_SHOW_FILTERS,
  );

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
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          >
            {/* Toggle & Action Buttons */}
            <div className="flex-row items-center gap-2">
              {isEditAllowed && !isLegacyMode && (
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-blue-600/20"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Connector</span>
                </button>
              )}
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
              connectors={paginatedConnectors as ConnectorExtended[]}
              showImages={showImages && !isLegacyMode}
              isLegacyMode={isLegacyMode}
              onLegacyConnectorUpdated={updateLegacyConnector}
              showFilters={showFilters}
              filters={filters}
              setFilterField={setFilterField}
              typeOptions={typeOptions}
              fabricanteOptions={fabricanteOptions}
              colorOptions={colorOptions}
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

      {showCreateModal && (
        <ModalWrapper
          onClose={() => setShowCreateModal(false)}
          title="Create New Connector"
          Icon={Plus}
          extraClasses="max-w-2xl"
        >
          <ConnectorCreateForm
            onCancel={() => setShowCreateModal(false)}
            onSave={() => setShowCreateModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
};
