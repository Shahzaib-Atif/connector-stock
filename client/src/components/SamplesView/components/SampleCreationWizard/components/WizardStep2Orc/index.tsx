import { RegAmostrasOrcRow } from "@/types/sampleCreation";
import { ArrowLeft, FileCheck } from "lucide-react";
import { getConnectorId } from "@/utils/idUtils";
import { useState } from "react";
import Filters from "./Filters";
import useFilters from "./useFilters";
import HeaderRow from "./HeaderRow";
import DataRow from "./DataRow";

interface Props {
  regAmostrasData: RegAmostrasOrcRow[];
  selectedRegRow: RegAmostrasOrcRow | null;
  handleCreateRegister: () => void;
  selectRegRow: (row: RegAmostrasOrcRow) => void;
  reset: () => void;
  goBack: () => void;
  error: string | null;
}

function WizardStep2Orc({
  goBack,
  error,
  regAmostrasData,
  selectRegRow,
  selectedRegRow,
  handleCreateRegister,
}: Props) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const {
    amostraFilter,
    setAmostraFilter,
    refClienteFilter,
    setRefClienteFilter,
    filteredData,
  } = useFilters(regAmostrasData);

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileCheck className="w-5 h-5 mr-2" />
          Select Sample Register (From ORC)
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
      <Filters
        amostraFilter={amostraFilter}
        refClienteFilter={refClienteFilter}
        setAmostraFilter={setAmostraFilter}
        setRefClienteFilter={setRefClienteFilter}
      />

      <div className="mb-4 bg-slate-700/50 rounded-lg p-4 overflow-x-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-600">
            <HeaderRow />
          </thead>
          <tbody>
            {filteredData.map((row, idx) => {
              // Get connector ID and check for image error
              const connectorId = getConnectorId(
                row.CDU_ModuloRefConetorDV || ""
              );
              const hasError = imgErrors[connectorId];

              return (
                <DataRow
                  connectorId={connectorId}
                  handleImgError={handleImgError}
                  key={idx}
                  row={row}
                  selectRegRow={selectRegRow}
                  selectedRegRow={selectedRegRow}
                  hasError={hasError}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreateRegister}
          disabled={!selectedRegRow || !!error}
          className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {error && selectedRegRow && selectedRegRow.ID !== 0
            ? "Already Registered"
            : "Create Register"}
        </button>
      </div>
    </div>
  );
}

export default WizardStep2Orc;
