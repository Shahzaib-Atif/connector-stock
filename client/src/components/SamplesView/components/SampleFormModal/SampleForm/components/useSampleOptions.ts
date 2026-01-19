import React from "react";
import { FORM_FIELDS_Type } from "./FormFieldType";
import { useAppSelector } from "@/store/hooks";

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
  function getOptions(field: FORM_FIELDS_Type): string[] {
    if (field.name === "Projeto") return projectsOptions;
    else if (field.name === "Amostra") return connectorOptions;
    else if (field.name === "Cliente") return clientsOptions;
    else return field.options;
  }

  return { getOptions };
}
