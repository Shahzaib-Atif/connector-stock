import { Search } from "lucide-react";

interface Props {
  refCliente: string;
  setRefCliente: (value: string) => void;
  searchAnaliseTab: () => void;
  loading: boolean;
  error: string | null;
}

function WizardStep1({
  refCliente,
  loading,
  error,
  setRefCliente,
  searchAnaliseTab,
}: Props) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <Search className="inline-block w-4 h-4 mr-1" />
          Enter RefCliente
        </label>
        <div className="flex gap-5 sm:gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={refCliente}
            onChange={(e) => setRefCliente(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchAnaliseTab()}
            placeholder="Enter client reference..."
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={searchAnaliseTab}
            disabled={loading || !refCliente.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default WizardStep1;
