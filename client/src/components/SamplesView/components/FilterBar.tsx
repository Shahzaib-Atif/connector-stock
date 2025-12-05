import React from "react";

interface FilterBarProps {
  clienteFilter: string;
  refDescricaoFilter: string;
  encDivmacFilter: string;
  onClienteChange: (value: string) => void;
  onRefDescricaoChange: (value: string) => void;
  onEncDivmacChange: (value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  clienteFilter,
  refDescricaoFilter,
  encDivmacFilter,
  onClienteChange,
  onRefDescricaoChange,
  onEncDivmacChange,
}) => {
  const inputClass =
    "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Cliente Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Cliente
        </label>
        <input
          type="text"
          value={clienteFilter}
          onChange={(e) => onClienteChange(e.target.value)}
          placeholder="Filter by client..."
          className={inputClass}
        />
      </div>

      {/* Ref_Descricao Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Ref. Descrição
        </label>
        <input
          type="text"
          value={refDescricaoFilter}
          onChange={(e) => onRefDescricaoChange(e.target.value)}
          placeholder="Filter by reference..."
          className={inputClass}
        />
      </div>

      {/* EncDivmac Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          EncDivmac
        </label>
        <input
          type="text"
          value={encDivmacFilter}
          onChange={(e) => onEncDivmacChange(e.target.value)}
          placeholder="Filter by EncDivmac..."
          className={inputClass}
        />
      </div>
    </div>
  );
};
