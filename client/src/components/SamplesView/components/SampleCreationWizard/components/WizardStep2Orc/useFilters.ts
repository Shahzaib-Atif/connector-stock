import { RegAmostrasOrcRow } from "@/types/sampleCreation";
import { useState, useMemo } from "react";

export default function useFilters(regAmostrasData: RegAmostrasOrcRow[]) {
  const [amostraFilter, setAmostraFilter] = useState("");
  const [refClienteFilter, setRefClienteFilter] = useState("");

  const filteredData = useMemo(() => {
    return regAmostrasData.filter((row) => {
      const conector = row.CDU_ModuloRefConetorDV || "";
      const refCliente = row.CDU_ModuloRefCliente || "";

      const matchesAmostra = amostraFilter
        ? conector.toLowerCase().includes(amostraFilter.toLowerCase())
        : true;
        
      const matchesRefCliente = refClienteFilter
        ? refCliente.toLowerCase().includes(refClienteFilter.toLowerCase())
        : true;

      return matchesAmostra && matchesRefCliente;
    });
  }, [regAmostrasData, amostraFilter, refClienteFilter]);

  return {
    amostraFilter,
    setAmostraFilter,
    refClienteFilter,
    setRefClienteFilter,
    filteredData,
  };
}
