import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useAccessoryFilters } from "@/hooks/useAccessoryFilters";
import { useImageToggle } from "@/hooks/useImageToggle";
import { DetailHeader } from "../common/DetailHeader";
import { AccessoriesTable } from "./AccessoriesTable";
import { AccessoriesFilterBar } from "./AccessoriesFilterBar";
import ImageToggleBtn from "../common/ImageToggleBtn";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { Accessory } from "@/utils/types";

export const AccessoriesListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData,
  );

  // Get accessories from masterData (default to empty object if not loaded)
  const accessories = masterData?.accessories ?? {};

  const { showImages, setShowImages } = useImageToggle("accessories_show_images");

  // Custom hook for filters
  const { 
    filters, 
    setFilterField, 
    clearFilters, 
    filteredAccessories,
    typeOptions,
    colorOptions
  } = useAccessoryFilters(accessories);

  const {
    paginatedItems: paginatedAccessories,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredAccessories, initialItemsPerPage: 25 });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Show spinner only when loading
  if (loading && !masterData) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="Accessories"
        title="All Accessories"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="accessories-content" className="table-view-content">
        <div className="table-view-inner-content">
          <AccessoriesFilterBar
            filters={filters}
            setFilterField={setFilterField}
            onClearFilters={clearFilters}
            typeOptions={typeOptions}
            colorOptions={colorOptions}
          >
            <ImageToggleBtn showImages={showImages} setShowImages={setShowImages} />
          </AccessoriesFilterBar>

          <div className="table-container-outer">
            <AccessoriesTable
              accessories={paginatedAccessories as Accessory[]}
              showImages={showImages}
            />
          </div>

          {filteredAccessories.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAccessories.length}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
