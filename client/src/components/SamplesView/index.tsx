import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sample } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSamplesThunk,
  deleteSampleThunk,
} from "@/store/slices/samplesSlice";
import { usePagination } from "@/hooks/usePagination";
import { useSampleFilters } from "@/hooks/useSampleFilters";
import { DetailHeader } from "../common/DetailHeader";
import { SamplesTable } from "./components/SamplesTable";
import { FilterBar } from "./components/FilterBar";
import { Pagination } from "./components/Pagination";
import { SampleFormModal } from "./components/SampleFormModal";
import Spinner from "../common/Spinner";

export const SamplesView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { samples, loading, error } = useAppSelector((state) => state.samples);

  // Custom hook for filters
  const {
    filters,
    setCliente,
    setRefDescricao,
    setEncDivmac,
    filteredSamples,
  } = useSampleFilters(samples);

  const {
    paginatedItems: paginatedSamples,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    resetPage,
  } = usePagination({ items: filteredSamples });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<Sample | null>(null);

  // Fetch samples on mount (only if not already loaded)
  useEffect(() => {
    if (samples.length === 0) {
      dispatch(fetchSamplesThunk());
    }
  }, [dispatch, samples.length]);

  // Reset page when filters change
  useEffect(() => {
    resetPage();
  }, [filters, resetPage]);

  const handleCreateNew = () => {
    setEditingSample(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sample: Sample) => {
    setEditingSample(sample);
    setIsModalOpen(true);
  };

  const handleDelete = async (sample: Sample) => {
    if (window.confirm(`Are you sure you want to delete this sample?`)) {
      dispatch(deleteSampleThunk(sample.ID));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSample(null);
  };

  const handleSaveSuccess = () => {
    handleModalClose();
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
        onBack={() => navigate("/")}
      />

      <div id="samples-content" className="table-view-content">
        <div className="max-w-full mx-auto h-full p-4 flex flex-col gap-4">
          {/* Action Bar */}
          <div className="flex justify-end flex-none">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30"
            >
              + New Sample
            </button>
          </div>

          <FilterBar
            clienteFilter={filters.cliente}
            refDescricaoFilter={filters.refDescricao}
            encDivmacFilter={filters.encDivmac}
            onClienteChange={setCliente}
            onRefDescricaoChange={setRefDescricao}
            onEncDivmacChange={setEncDivmac}
          />

          <div className="flex-1 min-h-0">
            {error ? (
              <div className="h-full flex items-center justify-center text-red-400 text-center px-4">
                {error}
              </div>
            ) : (
              <div className="flex h-full flex-col gap-4">
                <div className="flex-1 min-h-0">
                  <SamplesTable
                    samples={paginatedSamples}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SampleFormModal
          sample={editingSample}
          onClose={handleModalClose}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};
