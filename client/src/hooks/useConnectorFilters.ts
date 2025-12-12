import { useState, useMemo, useCallback } from "react";
import { ConnectorReferenceApiResponse } from "@/types";

export type ConnectorFilterColumn = "all" | "id" | "type" | "fabricante";

interface ConnectorFilters {
  filterColumn: ConnectorFilterColumn;
  searchQuery: string;
}

interface ConnectorListItem extends ConnectorReferenceApiResponse {
  id: string;
}

interface UseConnectorFiltersReturn {
  filters: ConnectorFilters;
  setFilterColumn: (column: ConnectorFilterColumn) => void;
  setSearchQuery: (query: string) => void;
  filteredConnectors: ConnectorListItem[];
  clearFilters: () => void;
}

export function useConnectorFilters(
  connectors: Record<string, ConnectorReferenceApiResponse>
): UseConnectorFiltersReturn {
  const [filters, setFilters] = useState<ConnectorFilters>({
    filterColumn: "all",
    searchQuery: "",
  });

  const setFilterColumn = useCallback((column: ConnectorFilterColumn) => {
    setFilters((prev) => ({ ...prev, filterColumn: column }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ filterColumn: "all", searchQuery: "" });
  }, []);

  // Convert Record to array with id
  const connectorsList = useMemo((): ConnectorListItem[] => {
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

function matchesAnyField(
  connector: ConnectorListItem,
  normalizedQuery: string
) {
  return (
    connector.id.toLowerCase().includes(normalizedQuery) ||
    connector.CODIVMAC?.toLowerCase().includes(normalizedQuery) ||
    connector.ConnType?.toLowerCase().includes(normalizedQuery) ||
    connector.Fabricante?.toLowerCase().includes(normalizedQuery) ||
    connector.Refabricante?.toLowerCase().includes(normalizedQuery) ||
    connector.Cor?.toLowerCase().includes(normalizedQuery) ||
    connector.Vias?.toLowerCase().includes(normalizedQuery)
  );
}

const getColumnValue = (
  connector: ConnectorListItem,
  column: ConnectorFilterColumn
): string => {
  switch (column) {
    case "id":
      return connector.id?.toLowerCase() ?? "";
    case "type":
      return connector.ConnType?.toLowerCase() ?? "";
    case "fabricante":
      return connector.Fabricante?.toLowerCase() ?? "";
    default:
      return "";
  }
};
