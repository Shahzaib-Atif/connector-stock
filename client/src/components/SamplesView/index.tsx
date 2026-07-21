import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { deleteSample } from "@/api/samplesApi";
import { DetailHeader } from "../common/DetailHeader";
import { SamplesTable } from "./components/SamplesTable";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import DeleteDialog from "../common/DeleteDialog";
import { ROUTES } from "../AppRoutes";
import { QRData } from "@/utils/types/shared";
import { UserRoles } from "@shared/enums/UserRoles";
import { FilterToolbar } from "../common/FilterToolbar";
import { SamplesDto } from "@shared/dto/SamplesDto";
import { useFiltersToggle } from "../../hooks/useFiltersToggle";
import { STORAGE_KEYS } from "@/utils/constants";
import { useSorting } from "./useSorting";
import useFilters from "./components/useFilters";
import useData from "./components/useData";
import ActionBar from "../common/NewSamplesActionBar";
import useNewSampleModal from "@/hooks/useNewSampleModal";
import { SampleFormModal } from "./components/SampleFormModal";
import { SampleCreationWizard } from "./components/SampleCreationWizard";

interface SamplesViewProps {
  onOpenQR?: (qrData: QRData) => void;
}

export const SamplesView: React.FC<SamplesViewProps> = ({ onOpenQR }) => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const [openDltDlg, setOpenDltDlg] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;

  const { showFilters, setShowFilters } = useFiltersToggle(
    STORAGE_KEYS.SAMPLES_SHOW_FILTERS,
  );

  const { filters, setFilterField, activeFiltersCount, clearFilters } =
    useFilters();
  const { dateSortDirection, handleDateSortToggle } = useSorting();
  const {
    rows,
    loading,
    error,
    totalItems,
    totalPages,
    entregueOptions,
    refetch,
  } = useData({
    filters,
    currentPage,
    itemsPerPage,
    dateSortDirection,
  });

  // Modal state
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
    setDuplicateSample,
    setEditingSample,
    setIsModalOpen,
    handleEdit,
  } = useNewSampleModal({ refetch });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleClone = (sample: SamplesDto) => {
    setDuplicateSample(sample);
    setEditingSample(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (sample: SamplesDto) => {
    setEditingSample(sample);
    setOpenDltDlg(true);
  };

  const handleConfirmDelete = async () => {
    if (editingSample?.ID == null) return;

    await deleteSample(editingSample.ID);
    setOpenDltDlg(false);
    setEditingSample(null);
    await refetch();
  };

  if (loading && rows.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="Samples"
        title="REG Amostras"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="samples-content" className="table-view-content">
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
            <SamplesTable
              samples={rows}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenQR={onOpenQR}
              onClone={handleClone}
              showActions={isAuthenticated && isAdmin}
              showFilters={showFilters}
              filters={filters}
              setFilterField={setFilterField}
              entregueOptions={entregueOptions}
              dateSortDirection={dateSortDirection}
              onDateSortToggle={handleDateSortToggle}
            />
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

      {!isModalOpen && (
        <DeleteDialog
          open={openDltDlg}
          setOpen={setOpenDltDlg}
          msg="Are you sure you want to delete this sample?"
          title="Delete Sample"
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};
