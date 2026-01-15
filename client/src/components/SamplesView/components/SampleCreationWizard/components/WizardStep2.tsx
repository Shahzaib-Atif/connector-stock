import { AnaliseTabRow } from "@/types/sampleCreation";
import { ArrowLeft, Database, Filter } from "lucide-react";
import { useState, useMemo } from "react";

interface Props {
  loading: boolean;
  proceedToRegAmostras: () => Promise<void>;
  selectedAnaliseRow: AnaliseTabRow | null;
  selectAnaliseRow: (row: AnaliseTabRow) => void;

  analiseTabData: AnaliseTabRow[];
  error: string | null;
  goBack: () => void;
}

function WizardStep2({
  goBack,
  error,
  loading,
  analiseTabData,
  selectedAnaliseRow,
  selectAnaliseRow,
  proceedToRegAmostras,
}: Props) {
  const [estadoFilter, setEstadoFilter] = useState("");
  const [encomendaFilter, setEncomendaFilter] = useState("");

  // Filter the data based on estado and encomenda
  const filteredData = useMemo(() => {
    return analiseTabData.filter((row) => {
      const matchesEstado = estadoFilter
        ? row.Estado.toLowerCase().includes(estadoFilter.toLowerCase())
        : true;
      const matchesEncomenda = encomendaFilter
        ? row.Encomenda.toLowerCase().includes(encomendaFilter.toLowerCase())
        : true;
      return matchesEstado && matchesEncomenda;
    });
  }, [analiseTabData, estadoFilter, encomendaFilter]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Select Analysis Data
        </h3>
        <button
          onClick={goBack}
          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex gap-3 items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex gap-3 flex-1">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">
              Filter by Estado
            </label>
            <input
              type="text"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              placeholder="Type to filter..."
              className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">
              Filter by Encomenda
            </label>
            <input
              type="text"
              value={encomendaFilter}
              onChange={(e) => setEncomendaFilter(e.target.value)}
              placeholder="Type to filter..."
              className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(estadoFilter || encomendaFilter) && (
            <button
              onClick={() => {
                setEstadoFilter("");
                setEncomendaFilter("");
              }}
              className="self-end px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 bg-slate-700/50 rounded-lg p-4 overflow-x-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600">
            <tr className="text-slate-300">
              <th className="px-3 py-2 text-left">Select</th>
              <th className="px-3 py-2 text-left">Encomenda</th>
              <th className="px-3 py-2 text-left">Conector</th>
              <th className="px-3 py-2 text-left min-w-32">Cliente</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-700 hover:bg-slate-600/50 cursor-pointer ${
                  selectedAnaliseRow === row ? "bg-blue-600/30" : ""
                }`}
                onClick={() => selectAnaliseRow(row)}
              >
                <td className="px-3 py-2">
                  <input
                    type="radio"
                    checked={selectedAnaliseRow === row}
                    onChange={() => selectAnaliseRow(row)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-3 py-2 text-white">{row.Encomenda}</td>
                <td className="px-3 py-2 text-white">{row.Conector}</td>
                <td className="px-3 py-2 text-white">{row.Cliente}</td>
                <td className="px-3 py-2 text-slate-300">{row.Estado}</td>
                <td className="px-3 py-2 text-slate-300">
                  {row.Quantidade || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={proceedToRegAmostras}
          disabled={!selectedAnaliseRow || loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Create Sample Register"}
        </button>
      </div>
    </div>
  );
}

export default WizardStep2;
