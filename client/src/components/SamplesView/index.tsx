import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSamplesThunk,
  deleteSampleThunk,
} from "@/store/slices/samplesSlice";
import { usePagination } from "@/hooks/usePagination";
import { useSampleFilters } from "@/hooks/useSampleFilters";
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
import { SamplesFilterBar } from "./SamplesFilterBar";
import { getActiveFilterCount } from "./constants";
import { CreateSamplesDto, SamplesDto } from "@shared/dto/SamplesDto";
import { useFiltersToggle } from "../ConnectorsTable/ConnectorsTable/useFiltersToggle";
import { STORAGE_KEYS } from "@/utils/constants";
import ActionBar from "./components/ActionBar";
import { LineStatusContext } from "@/utils/functions/divDesk";
import { useSorting } from "./useSorting";

interface SamplesViewProps {
  onOpenQR?: (qrData: QRData) => void;
}

export const SamplesView: React.FC<SamplesViewProps> = ({ onOpenQR }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { samples, loading } = useAppSelector((state) => state.samples);
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const [openDltDlg, setOpenDltDlg] = useState(false);
  const isAdmin = role === UserRoles.Admin || role === UserRoles.Master;

  // Custom hook for filters
  const {
    filters,
    setFilterField,
    filteredSamples,
    clearFilters,
    entregueOptions,
  } = useSampleFilters(samples);
  const activeFiltersCount = getActiveFilterCount(filters);
  const { showFilters, setShowFilters } = useFiltersToggle(
    STORAGE_KEYS.SAMPLES_SHOW_FILTERS,
  );

  const { sortedSamples, dateSortDirection, handleDateSortToggle } = useSorting(
    { filteredSamples },
  );

  const {
    paginatedItems: paginatedSamples,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: sortedSamples });

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

  // Fetch samples on mount (only if not already loaded)
  useEffect(() => {
    if (samples.length === 0) {
      dispatch(fetchSamplesThunk());
    }
  }, [dispatch, samples.length]);

  // Reset page when filters change
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

  const handleSaveSuccess = () => {
    handleModalClose();
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

  // Show spinner only when loading
  if (loading && samples.length === 0) {
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
          {/* Action Bar */}
          {isAuthenticated && isAdmin && (
            <ActionBar
              handleCreateNew={handleCreateNew}
              handleOpenWizard={handleOpenWizard}
            />
          )}

          <SamplesFilterBar
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />

          <div className="table-container-outer">
            <SamplesTable
              samples={paginatedSamples as SamplesDto[]}
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

          {filteredSamples.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredSamples.length}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>

      {/* Modal */}
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

      {/* Wizard */}
      {isWizardOpen && (
        <SampleCreationWizard
          onClose={handleWizardClose}
          onProceedToForm={handleProceedToForm}
        />
      )}

      {/* Delete Dialog */}
      {!isModalOpen && (
        <DeleteDialog
          open={openDltDlg}
          setOpen={setOpenDltDlg}
          msg="Are you sure you want to delete this sample?"
          title="Delete Sample"
          onDelete={() => dispatch(deleteSampleThunk(editingSample?.ID))}
        />
      )}
    </div>
  );
};
