import React from "react";
import { Eraser, Filter } from "lucide-react";
import { useFiltersToggle } from "../ConnectorsTable/ConnectorsTable/useFiltersToggle";
import { ActiveFiltersIndicator } from "../common/ActiveFiltersIndicator";
import { SampleFilters } from "./constants";
import {
  FILTER_BAR_CONTAINER,
  FILTER_BAR_TOP_ROW,
  filterStyles,
} from "@/utils/filterUtils";

interface SamplesFilterBarProps {
  filters: SampleFilters;
  setFilterField: (key: keyof SampleFilters, value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  children?: React.ReactNode;
}

export const SamplesFilterBar: React.FC<SamplesFilterBarProps> = ({
  filters,
  setFilterField,
  onClearFilters,
  activeFiltersCount,
  children,
}) => {
  const { showFilters, setShowFilters } = useFiltersToggle();

  return (
    <div id="samples-filter-bar" className={FILTER_BAR_CONTAINER}>
      <div className={FILTER_BAR_TOP_ROW}>
        <div className="flex-row">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={filterStyles.button}
            aria-expanded={showFilters}
            aria-controls="samples-filter-panel"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showFilters ? "Hide filters" : "Show filters"}
            </span>
          </button>

          <button
            type="button"
            onClick={onClearFilters}
            className={filterStyles.button}
          >
            <Eraser className="h-4 w-4" />
            Clear filters
          </button>

          <ActiveFiltersIndicator count={activeFiltersCount} />
        </div>

        {children && <div className="flex-row">{children}</div>}
      </div>

      {showFilters && (
        <div id="samples-filter-panel" className="filter-panel">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 flex-wrap">
            <div className={filterStyles.container}>
              <label htmlFor="sample-id-search" className={filterStyles.label}>
                ID
              </label>
              <input
                id="sample-id-search"
                type="text"
                value={filters.idQuery}
                onChange={(e) => setFilterField("idQuery", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-cliente-search"
                className={filterStyles.label}
              >
                Cliente
              </label>
              <input
                id="sample-cliente-search"
                type="text"
                value={filters.cliente}
                onChange={(e) => setFilterField("cliente", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-projeto-search"
                className={filterStyles.label}
              >
                Projeto
              </label>
              <input
                id="sample-projeto-search"
                type="text"
                value={filters.projeto}
                onChange={(e) => setFilterField("projeto", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-encdivmac-search"
                className={filterStyles.label}
              >
                EncDivmac
              </label>
              <input
                id="sample-encdivmac-search"
                type="text"
                value={filters.encDivmac}
                onChange={(e) => setFilterField("encDivmac", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-refdescricao-search"
                className={filterStyles.label}
              >
                Ref. Descricao
              </label>
              <input
                id="sample-refdescricao-search"
                type="text"
                value={filters.refDescricao}
                onChange={(e) => setFilterField("refDescricao", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-amostra-search"
                className={filterStyles.label}
              >
                Amostra
              </label>
              <input
                id="sample-amostra-search"
                type="text"
                value={filters.amostra}
                onChange={(e) => setFilterField("amostra", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-numorc-search"
                className={filterStyles.label}
              >
                NumORC
              </label>
              <input
                id="sample-numorc-search"
                type="text"
                value={filters.numORC}
                onChange={(e) => setFilterField("numORC", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>

            <div className={filterStyles.container}>
              <label
                htmlFor="sample-entreguea-search"
                className={filterStyles.label}
              >
                Entregue A
              </label>
              <input
                id="sample-entreguea-search"
                type="text"
                value={filters.entregueA}
                onChange={(e) => setFilterField("entregueA", e.target.value)}
                placeholder="All"
                className={filterStyles.input}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
