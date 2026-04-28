import React from "react";
import { useAppSelector } from "@/store/hooks";
import { CreateSamplesDto } from "@shared/dto/SamplesDto";

export default function useSampleOptions() {
  const { data: masterData } = useAppSelector((state) => state.masterData);

  // Get connector options for autocomplete
  const connectorOptions = React.useMemo(() => {
    if (!masterData?.connectors) return [];
    return Object.keys(masterData.connectors).sort();
  }, [masterData]);

  // get projects and clients options from samples state
  const projectsOptions = useAppSelector((state) => state.samples.projects);
  const clientsOptions = useAppSelector((state) => state.samples.clients);

  // Get options for autocomplete fields
  function getOptions(
    fieldName: keyof CreateSamplesDto,
    fallbackOptions: string[] = [],
  ) {
    if (fieldName === "Projeto") return projectsOptions;
    if (fieldName === "Amostra") return connectorOptions;
    if (fieldName === "Cliente") return clientsOptions;

    return fallbackOptions;
  }

  return { getOptions };
}
