import { AnaliseTabRow } from "@/types/sampleCreation";
import { useState, useMemo } from "react";

export default function useFilters(analiseTabData: AnaliseTabRow[]) {
  const [estadoFilter, setEstadoFilter] = useState("");
  const [encomendaFilter, setEncomendaFilter] = useState("");

  // Get unique estados for the dropdown
  const uniqueEstados = useMemo(() => {
    const estados = analiseTabData.map((row) => row.Estado);
    return Array.from(new Set(estados)).filter(Boolean).sort();
  }, [analiseTabData]);

  // Filter the data based on estado and encomenda
  const filteredData = useMemo(() => {
    return analiseTabData.filter((row) => {
      const matchesEstado = estadoFilter ? row.Estado === estadoFilter : true;
      const matchesEncomenda = encomendaFilter
        ? row.Encomenda.toLowerCase().includes(encomendaFilter.toLowerCase())
        : true;
      return matchesEstado && matchesEncomenda;
    });
  }, [analiseTabData, estadoFilter, encomendaFilter]);

  return {
    estadoFilter,
    setEstadoFilter,
    encomendaFilter,
    setEncomendaFilter,
    uniqueEstados,
    filteredData,
  };
}
