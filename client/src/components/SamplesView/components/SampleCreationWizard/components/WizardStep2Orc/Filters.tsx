import { Filter } from "lucide-react";

interface Props {
  amostraFilter: string;
  refClienteFilter: string;
  setAmostraFilter: React.Dispatch<React.SetStateAction<string>>;
  setRefClienteFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function Filters({
  amostraFilter,
  refClienteFilter,
  setAmostraFilter,
  setRefClienteFilter,
}: Props) {
  return (
    <div className="w-fit mb-4 flex gap-3 items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <Filter className="sm:block hidden w-5 h-5 text-slate-400" />
      <div className="flex gap-3 flex-1">
        {/* Filter by Amostra */}
        <div className={filterDivClass}>
          <label className={labelClass}>Filter by Amostra</label>
          <input
            type="text"
            name="amostraFilter"
            value={amostraFilter}
            onChange={(e) => setAmostraFilter(e.target.value)}
            placeholder="Type to filter..."
            className={inputClass}
            autoComplete="on"
          />
        </div>

        {/* Filter By RefCliente */}
        <div className={filterDivClass}>
          <label className={labelClass}>Filter by RefCliente</label>
          <input
            type="text"
            name="refClienteFilter"
            value={refClienteFilter}
            onChange={(e) => setRefClienteFilter(e.target.value)}
            placeholder="Type to filter..."
            className={inputClass}
            autoComplete="on"
          />
        </div>

        {/* Clear Button */}
        <button
          onClick={() => {
            setAmostraFilter("");
            setRefClienteFilter("");
          }}
          disabled={!(amostraFilter || refClienteFilter)}
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
const filterDivClass = "flex-1 min-w-64";
