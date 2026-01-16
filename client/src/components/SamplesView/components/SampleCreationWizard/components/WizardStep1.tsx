import { Search, FileText, ShoppingCart } from "lucide-react";
import { WizardFlow } from "@/hooks/useSampleCreationWizard";

interface Props {
  refCliente: string;
  flow: WizardFlow;
  setFlow: (flow: WizardFlow) => void;
  setRefCliente: (value: string) => void;
  searchAnaliseTab: () => void;
  loading: boolean;
  error: string | null;
}

function WizardStep1({
  refCliente,
  flow,
  loading,
  error,
  setFlow,
  setRefCliente,
  searchAnaliseTab,
}: Props) {
  return (
    <div className="p-6">
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFlow("ECL")}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold ${
            flow === "ECL"
              ? "bg-blue-600/20 border-blue-500 text-blue-400"
              : "bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          With Enc.
        </button>
        <button
          onClick={() => setFlow("ORC")}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold ${
            flow === "ORC"
              ? "bg-blue-600/20 border-blue-500 text-blue-400"
              : "bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500"
          }`}
        >
          <FileText className="w-5 h-5" />
          With ORC
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <Search className="inline-block w-4 h-4 mr-1" />
          {flow === "ECL" ? "Enter RefCliente" : "Enter Budget Number (ORC)"}
        </label>
        <div className="flex gap-5 sm:gap-3 flex-col sm:flex-row">
          <input
            type="text"
            value={refCliente}
            onChange={(e) => setRefCliente(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchAnaliseTab()}
            placeholder={
              flow === "ECL"
                ? "Enter client reference..."
                : "Enter ORC number (e.g. 2024/123)..."
            }
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
