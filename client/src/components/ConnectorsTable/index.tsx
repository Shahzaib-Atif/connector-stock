import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useConnectorFilters } from "@/hooks/useConnectorFilters";
import { DetailHeader } from "../common/DetailHeader";
import { ConnectorsTable } from "./ConnectorsTable";
import { FilterBar } from "../common/FilterBar";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { Image, ImageOff, Database, History } from "lucide-react";
import { Connector } from "@/utils/types";
import { fetchLegacyBackups } from "@/api/legacyApi";
import { mapLegacyToConnector } from "@/services/connectorService";

export const ConnectorsListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData,
  );

  // Photo visibility state with persistence
  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem("connectors_show_images");
    return saved === "true"; // Default to false
  });

  const [isLegacyMode, setIsLegacyMode] = useState(false);
  const [legacyData, setLegacyData] = useState<Record<string, Connector>>({});
  const [legacyLoading, setLegacyLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("connectors_show_images", String(showImages));
  }, [showImages]);

  useEffect(() => {
    if (isLegacyMode && Object.keys(legacyData).length === 0 && masterData) {
      const loadLegacy = async () => {
        setLegacyLoading(true);
        try {
          const backups = await fetchLegacyBackups();
          const mapped: Record<string, Connector> = {};
          backups.forEach((b) => {
            const connector = mapLegacyToConnector(b, masterData);
            mapped[connector.CODIVMAC] = connector;
          });
          setLegacyData(mapped);
        } catch (err) {
          console.error("Failed to load legacy data", err);
        } finally {
          setLegacyLoading(false);
        }
      };
      loadLegacy();
    }
  }, [isLegacyMode, masterData]);

  // Get connectors from masterData or legacy data
  const connectors = isLegacyMode ? legacyData : (masterData?.connectors ?? {});

  // Custom hook for filters
  const { filters, setFilterColumn, setSearchQuery, filteredConnectors } =
    useConnectorFilters(connectors);

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
          <FilterBar
            filterColumn={filters.filterColumn}
            searchQuery={filters.searchQuery}
            filterByOptions={["id", "type", "fabricante"]}
            onFilterColumnChange={setFilterColumn}
            onSearchQueryChange={setSearchQuery}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLegacyMode(!isLegacyMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium h-[42px] sm:h-auto ${
                  isLegacyMode
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
                title={
                  isLegacyMode ? "Switch to Live Data" : "Switch to Legacy Data"
                }
              >
                {isLegacyMode ? (
                  <>
                    <Database className="w-4 h-4" />
                    <span>View Live</span>
                  </>
                ) : (
                  <>
                    <History className="w-4 h-4" />
                    <span>View Legacy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowImages(!showImages)}
                className={`w-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium h-[42px] sm:h-auto ${
                  showImages
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {showImages ? (
                  <>
                    <Image className="w-4 h-4" />
                    <span>Photos: Show</span>
                  </>
                ) : (
                  <>
                    <ImageOff className="w-4 h-4" />
                    <span>Photos: Hide</span>
                  </>
                )}
              </button>
            </div>
          </FilterBar>

          <div className="table-container-outer">
            <ConnectorsTable
              connectors={paginatedConnectors as Connector[]}
              showImages={showImages}
            />
          </div>

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
