import { Filter } from "lucide-react";

interface Props {
  estadoFilter: string;
  encomendaFilter: string;
  setEstadoFilter: React.Dispatch<React.SetStateAction<string>>;
  setEncomendaFilter: React.Dispatch<React.SetStateAction<string>>;
  uniqueEstados: string[];
}

export default function Filters({
  estadoFilter,
  encomendaFilter,
  setEstadoFilter,
  setEncomendaFilter,
  uniqueEstados,
}: Props) {
  return (
    <div className="mb-4 flex gap-3 items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <Filter className="w-5 h-5 text-slate-400" />
      <div className="flex gap-3 flex-1">
        {/* Filter by Encomenda */}
        <div className="flex-1">
          <label className={labelClass}>Filter by Encomenda</label>
          <input
            type="text"
            value={encomendaFilter}
            onChange={(e) => setEncomendaFilter(e.target.value)}
            placeholder="Type to filter..."
            className={inputClass}
          />
        </div>

        {/* Filter By Estado */}
        <div className="flex-1">
          <label className={labelClass}>Filter by Estado</label>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className={inputClass}
          >
            <option value="">All</option>
            {uniqueEstados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        <button
          onClick={() => {
            setEstadoFilter("");
            setEncomendaFilter("");
          }}
          disabled={!(estadoFilter || encomendaFilter)}
          className="self-end px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

const labelClass = "block text-xs text-slate-400 mb-1";
const inputClass =
  "w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
