import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "../common/DetailHeader";
import { ROUTES } from "../AppRoutes";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { FilterToolbar } from "../common/FilterToolbar";
import { useFiltersToggle } from "../../hooks/useFiltersToggle";
import { STORAGE_KEYS } from "@/utils/constants";
import { Pagination } from "../common/Pagination";
import TableHeader from "./components/TableHeader";
import TableRows from "./components/TableRows";
import useFilters from "./components/useFilters";
import useData from "./components/useData";
import { useSorting } from "./components/useSorting";
import { useConnectorSave } from "./components/useConnectorSave";
import DivDeskReclickModal from "./components/DivDeskReclickModal";
import { useAppSelector } from "@/store/hooks";
import Spinner from "../common/Spinner";
import { setLineStatus, refreshConnNameCache } from "@/utils/functions/divDesk";
import SimilarRowsConnectorModal from "./components/SimilarRowsConnectorModal";
import ActionBar from "../common/NewSamplesActionBar";
import { UserRoles } from "@shared/enums/UserRoles";
import useSamplesData from "../../components/SamplesView/components/useData";
import useSamplesFilters from "../../components/SamplesView/components/useFilters";
import useNewSampleModal from "@/hooks/useNewSampleModal";
import { SampleCreationWizard } from "../SamplesView/components/SampleCreationWizard";
import { SampleFormModal } from "../SamplesView/components/SampleFormModal";

// Analise tab page with filters, pagination, and edits.
export const AnaliseTable: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showFilters, setShowFilters } = useFiltersToggle(
    STORAGE_KEYS.ANALISE_TAB_SHOW_FILTERS,
  );

  // analise table filters
  const { filters, setFilters, activeFiltersCount, clearFilters } =
    useFilters();

  // Samples filters
  const { filters: samplesFilters } = useSamplesFilters();
  const { refetch } = useSamplesData({
    filters: samplesFilters,
    currentPage: 1,
    itemsPerPage: 50,
    dateSortDirection: "desc",
  });

  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;

  const { dateSortDirection, handleDateSortToggle } = useSorting();
  const {
    rows,
    loading,
    error,
    handleUpdateConnector,
    handleUpdateStatus,
    totalItems,
    totalPages,
  } = useData({
    filters,
    currentPage,
    itemsPerPage,
    dateSortDirection,
  });

  const {
    isModalOpen,
    duplicateSample,
    isWizardOpen,
    editingSample,
    lineStatusContext,
    prefillData,
    handleCreateNew,
    handleOpenWizard,
    handleWizardClose,
    handleProceedToForm,
    handleSaveSuccess,
    handleModalClose,
  } = useNewSampleModal({ refetch });

  const {
    pendingSave,
    reclickWizard,
    isCheckingSimilar,
    handleConnectorSave,
    handleOnlyThisRow,
    handleApplyToAll,
    handleLaunchReclickStep,
    closePendingModal,
    closeReclickWizard,
  } = useConnectorSave({ onUpdateConnector: handleUpdateConnector, user });

  // Calls setLineStatus via DIVDESK and refreshes cache.
  const handleStatusSave = React.useCallback(
    async (row: AnaliseTabDto, newStatus: string) => {
      if (!row.Encomenda || row.NumLinha == null) return;

      // Local optimistic update
      handleUpdateStatus(row.Encomenda, row.NumLinha, newStatus);

      try {
        await setLineStatus(row.Encomenda, row.NumLinha, user || "undefined");
      } catch (err) {
        console.error("Failed to update status:", err);
      }

      // Refresh database cache
      await refreshConnNameCache();
    },
    [handleUpdateStatus, user],
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, setCurrentPage]);

  // Show loading spinner while fetching data
  if (loading && rows.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="AnaliseTab"
        title="Analise Tab"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div className="table-view-content">
        <div className="table-view-inner-content">
          <FilterToolbar
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          >
            {isAuthenticated && isAdmin && (
              <ActionBar
                handleCreateNew={handleCreateNew}
                handleOpenWizard={handleOpenWizard}
              />
            )}
          </FilterToolbar>

          {error && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="table-container-outer">
            <div className="table-container-inner">
              <table className="w-full min-w-[1400px] table-auto">
                <TableHeader
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                  dateSortDirection={dateSortDirection}
                  onDateSortToggle={handleDateSortToggle}
                />
                <tbody>
                  <TableRows
                    paginatedItems={rows as AnaliseTabDto[]}
                    isCheckingSimilar={isCheckingSimilar}
                    onConnectorSave={handleConnectorSave}
                    onStatusSave={handleStatusSave}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>

      {pendingSave && (
        <SimilarRowsConnectorModal
          sourceRow={pendingSave.row}
          newConnector={pendingSave.newConnector}
          similarRows={pendingSave.similarRows}
          onOnlyThisRow={handleOnlyThisRow}
          onApplyToAll={handleApplyToAll}
          onClose={closePendingModal}
        />
      )}

      {reclickWizard && (
        <DivDeskReclickModal
          newConnector={reclickWizard.newConnector}
          steps={reclickWizard.steps}
          currentStep={reclickWizard.currentStep}
          onLaunchStep={handleLaunchReclickStep}
          onClose={closeReclickWizard}
        />
      )}

      {isWizardOpen && (
        <SampleCreationWizard
          onClose={handleWizardClose}
          onProceedToForm={handleProceedToForm}
        />
      )}

      {isModalOpen && (
        <SampleFormModal
          sample={editingSample ?? duplicateSample}
          onClose={handleModalClose}
          onSuccess={handleSaveSuccess}
          forceCreate={!!duplicateSample}
          initialData={prefillData}
          lineStatusContext={lineStatusContext}
        />
      )}
    </div>
  );
};
