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

export const SamplesView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const { samples, loading, error } = useAppSelector((state) => state.samples);

  // Custom hooks
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
    totalItems,
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 pb-8 text-slate-200">
      <DetailHeader
        label="Samples"
        title="REG Amostras"
        onBack={() => navigate("/")}
      />

      <div className="max-w-full mx-auto p-4 space-y-4">
        {/* Action Bar */}
        <div className="flex justify-end">
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

        {error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <>
            <SamplesTable
              samples={paginatedSamples}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </>
        )}
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
