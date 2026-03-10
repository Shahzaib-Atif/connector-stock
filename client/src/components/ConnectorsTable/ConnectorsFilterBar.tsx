import React, { useState } from "react";
import { Eraser, Filter } from "lucide-react";

interface ConnectorsFilterBarProps {
  idQuery: string;
  onIdQueryChange: (value: string) => void;

  type: string;
  onTypeChange: (value: string) => void;
  typeOptions: string[];

  fabricante: string;
  onFabricanteChange: (value: string) => void;
  fabricanteOptions: string[];

  family: string;
  onFamilyChange: (value: string) => void;

  vias: string;
  onViasChange: (value: string) => void;
  viasOptions: string[];

  color: string;
  onColorChange: (value: string) => void;
  colorOptions: string[];

  onClearFilters: () => void;
  children?: React.ReactNode;
}

export const ConnectorsFilterBar: React.FC<ConnectorsFilterBarProps> = ({
  idQuery,
  onIdQueryChange,
  type,
  onTypeChange,
  typeOptions,
  fabricante,
  onFabricanteChange,
  fabricanteOptions,
  family,
  onFamilyChange,
  vias,
  onViasChange,
  viasOptions,
  color,
  onColorChange,
  colorOptions,
  onClearFilters,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <div
      id="connectors-filter-bar"
      className="text-sm sm:text-base flex flex-col gap-3 sm:gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700"
    >
      {/* Top row: filter toggle + clear button + optional actions */}
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={btnClass}
            aria-expanded={isOpen}
            aria-controls="connectors-filter-panel"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isOpen ? "Hide filters" : "Show filters"}
            </span>
          </button>

          <button type="button" onClick={handleClear} className={btnClass}>
            <Eraser className="h-4 w-4" />
            Clear filters
          </button>
        </div>

        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>

      {/* Collapsible filter panel */}
      {isOpen && (
        <div
          id="connectors-filter-panel"
          className="flex flex-col gap-3 sm:gap-4 mt-2"
        >
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* ID Search */}
            <div className={containerDiv}>
              <label htmlFor="connector-id-search" className={labelClass}>
                Search ID
              </label>
              <input
                id="connector-id-search"
                type="text"
                value={idQuery}
                onChange={(e) => onIdQueryChange(e.target.value)}
                autoComplete="off"
                placeholder="connector Id..."
                className={inputStyle}
              />
            </div>

            {/* Type */}
            <div className={containerDiv}>
              <label htmlFor="connector-type-filter" className={labelClass}>
                Type
              </label>
              <select
                id="connector-type-filter"
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Fabricante */}
            <div className={containerDiv}>
              <label
                htmlFor="connector-fabricante-filter"
                className={labelClass}
              >
                Fabricante
              </label>
              <select
                id="connector-fabricante-filter"
                value={fabricante}
                onChange={(e) => onFabricanteChange(e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {fabricanteOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Family (text input) */}
            <div className={containerDiv}>
              <label htmlFor="connector-family-filter" className={labelClass}>
                Family
              </label>
              <input
                id="connector-family-filter"
                type="text"
                value={family}
                onChange={(e) => onFamilyChange(e.target.value)}
                autoComplete="off"
                placeholder="Enter family..."
                className={inputStyle}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch">
            {/* Vias */}
            <div className={containerDiv}>
              <label htmlFor="connector-vias-filter" className={labelClass}>
                Vias
              </label>
              <select
                id="connector-vias-filter"
                value={vias}
                onChange={(e) => onViasChange(e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {viasOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className={containerDiv}>
              <label htmlFor="connector-color-filter" className={labelClass}>
                Color
              </label>
              <select
                id="connector-color-filter"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className={selectStyle}
              >
                <option value="all">All</option>
                {colorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelClass = "label-style-1 text-sm mb-[2px]";
const btnClass =
  "inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-slate-100 transition-colors text-xs sm:text-sm gap-1 hover:bg-slate-600";
const selectStyle =
  "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
const containerDiv = "w-full sm:w-48";
const inputStyle =
  "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
