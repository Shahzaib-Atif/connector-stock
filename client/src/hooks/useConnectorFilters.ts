import { FilterColumnTypes } from "@/components/common/FilterBar";
import { Connector } from "@/utils/types";
import { useState, useMemo, useCallback } from "react";

interface ConnectorFilters {
  filterColumn: FilterColumnTypes;
  searchQuery: string;
}

export function useConnectorFilters(connectors: Record<string, Connector>) {
  const [filters, setFilters] = useState<ConnectorFilters>({
    filterColumn: "all",
    searchQuery: "",
  });

  const setFilterColumn = useCallback((column: FilterColumnTypes) => {
    setFilters((prev) => ({ ...prev, filterColumn: column }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ filterColumn: "all", searchQuery: "" });
  }, []);

  // Convert Record to array with id
  const connectorsList = useMemo((): Connector[] => {
    return Object.entries(connectors).map(([id, connector]) => ({
      id,
      ...connector,
    }));
  }, [connectors]);

  const filteredConnectors = useMemo(() => {
    const normalizedQuery = filters.searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return connectorsList;
    }

    return connectorsList.filter((connector) => {
      if (filters.filterColumn === "all") {
        return matchesAnyField(connector, normalizedQuery);
      } else {
        const columnValue = getColumnValue(connector, filters.filterColumn);
        return columnValue.includes(normalizedQuery);
      }
    });
  }, [connectorsList, filters]);

  return {
    filters,
    setFilterColumn,
    setSearchQuery,
    filteredConnectors,
    clearFilters,
  };
}

function matchesAnyField(connector: Connector, normalizedQuery: string) {
  return (
    connector.CODIVMAC.toLowerCase().includes(normalizedQuery) ||
    connector.CODIVMAC?.toLowerCase().includes(normalizedQuery) ||
    connector.ConnType?.toLowerCase().includes(normalizedQuery) ||
    connector.details.Fabricante?.toLowerCase().includes(normalizedQuery) ||
    connector.details.Refabricante?.toLowerCase().includes(normalizedQuery) ||
    connector.Cor?.toLowerCase().includes(normalizedQuery) ||
    connector.Vias?.toLowerCase().includes(normalizedQuery) ||
    connector.details.OBS?.toLowerCase().includes(normalizedQuery)
  );
}

const getColumnValue = (connector: Connector, column: FilterColumnTypes) => {
  switch (column) {
    case "id":
      return connector.CODIVMAC?.toLowerCase() ?? "";
    case "type":
      return connector.ConnType?.toLowerCase() ?? "";
    case "fabricante":
      return connector.details.Fabricante?.toLowerCase() ?? "";
    case "family":
      return connector.details.Family?.toString() ?? "";
    case "vias":
      return connector.Vias?.toLowerCase() ?? "";
    case "color":
      return connector.Cor?.toLowerCase() ?? "";
    default:
      return "";
  }
};
