import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { deleteSample } from "@/api/samplesApi";
import { DetailHeader } from "../common/DetailHeader";
import { SamplesTable } from "./components/SamplesTable";
import { Pagination } from "../common/Pagination";
import { SampleFormModal } from "./components/SampleFormModal";
import { SampleCreationWizard } from "./components/SampleCreationWizard";
import Spinner from "../common/Spinner";
import DeleteDialog from "../common/DeleteDialog";
import { ROUTES } from "../AppRoutes";
import { QRData } from "@/utils/types/shared";
import { UserRoles } from "@shared/enums/UserRoles";
import { FilterToolbar } from "../common/FilterToolbar";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { useFiltersToggle } from "../../hooks/useFiltersToggle";
import { STORAGE_KEYS } from "@/utils/constants";
import ActionBar from "./components/ActionBar";
import { LineStatusContext } from "@/utils/functions/divDesk";
import { useSorting } from "./useSorting";
import useFilters from "./components/useFilters";
import useData from "./components/useData";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<SamplesDto | null>(null);
  const [duplicateSample, setDuplicateSample] = useState<SamplesDto | null>(
    null,
  );
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<
    Partial<CreateSamplesDto> | undefined
  >();
  const [lineStatusContext, setLineStatusContext] = useState<
    LineStatusContext | undefined
  >();

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleCreateNew: () => void = () => {
    setEditingSample(null);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sample: SamplesDto) => {
    setEditingSample(sample);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  const handleClone = (sample: SamplesDto) => {
    setDuplicateSample(sample);
    setEditingSample(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (sample: SamplesDto) => {
    setEditingSample(sample);
    setOpenDltDlg(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSample(null);
    setDuplicateSample(null);
    setPrefillData(undefined);
    setLineStatusContext(undefined);
  };

  const handleSaveSuccess = async () => {
    handleModalClose();
    await refetch();
  };

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  const handleProceedToForm = (
    data: Partial<CreateSamplesDto>,
    statusContext?: LineStatusContext,
  ) => {
    setPrefillData(data);
    setLineStatusContext(statusContext);
    setEditingSample(null);
    setDuplicateSample(null);
    setIsModalOpen(true);
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
          {isAuthenticated && isAdmin && (
            <ActionBar
              handleCreateNew={handleCreateNew}
              handleOpenWizard={handleOpenWizard}
            />
          )}

          <FilterToolbar
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />

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

      {isWizardOpen && (
        <SampleCreationWizard
          onClose={handleWizardClose}
          onProceedToForm={handleProceedToForm}
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
