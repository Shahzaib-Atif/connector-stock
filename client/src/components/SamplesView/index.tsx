import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sample } from "@/utils/types";
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
import { SampleFormData } from "@/hooks/useSampleForm";
import Spinner from "../common/Spinner";
import DeleteDialog from "../common/DeleteDialog";
import { FilterBar } from "../common/FilterBar";
import { ROUTES } from "../AppRoutes";
import { QRData } from "@/utils/types/shared";

interface SamplesViewProps {
  onOpenQR?: (qrData: QRData) => void;
}

export const SamplesView: React.FC<SamplesViewProps> = ({ onOpenQR }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { samples, loading } = useAppSelector((state) => state.samples);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [openDltDlg, setOpenDltDlg] = useState(false);

  // Custom hook for filters
  const { filters, setFilterColumn, setSearchQuery, filteredSamples } =
    useSampleFilters(samples);

  const {
    paginatedItems: paginatedSamples,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredSamples });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<Sample | null>(null);
  const [duplicateSample, setDuplicateSample] = useState<Sample | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<
    Partial<SampleFormData> | undefined
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

  const handleCreateNew = () => {
    setEditingSample(null);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sample: Sample) => {
    setEditingSample(sample);
    setDuplicateSample(null);
    setIsModalOpen(true);
  };

  const handleClone = (sample: Sample) => {
    setDuplicateSample(sample);
    setEditingSample(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (sample: Sample) => {
    setEditingSample(sample);
    setOpenDltDlg(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSample(null);
    setDuplicateSample(null);
    setPrefillData(undefined);
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

  const handleProceedToForm = (data: Partial<SampleFormData>) => {
    setPrefillData(data);
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
          <div className="flex justify-end gap-3 flex-none">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleOpenWizard}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-600/30"
                >
                  Create from Reference
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30"
                >
                  + New Sample
                </button>
              </>
            )}
          </div>

          <FilterBar
            filterColumn={filters.filterColumn}
            searchQuery={filters.searchQuery}
            filterByOptions={[
              "cliente",
              "refDescricao",
              "encDivmac",
              "amostra",
              "numORC",
            ]}
            onFilterColumnChange={setFilterColumn}
            onSearchQueryChange={setSearchQuery}
          />

          <div className="table-container-outer">
            <SamplesTable
              samples={paginatedSamples as Sample[]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenQR={onOpenQR}
              onClone={handleClone}
              showActions={isAuthenticated}
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

      {isModalOpen && (
        <SampleFormModal
          sample={editingSample ?? duplicateSample}
          onClose={handleModalClose}
          onSuccess={handleSaveSuccess}
          forceCreate={!!duplicateSample}
          initialData={prefillData}
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
          onDelete={() => dispatch(deleteSampleThunk(editingSample.ID))}
        />
      )}
    </div>
  );
};
