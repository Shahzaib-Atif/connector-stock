import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getSamplesOptions } from "@/api/samplesApi";
import { CreateSamplesDto } from "@shared/dto/SamplesDto";

export default function useSampleOptions() {
  const { data: masterData } = useAppSelector((state) => state.masterData);
  const [projectsOptions, setProjectsOptions] = useState<string[]>([]);
  const [clientsOptions, setClientsOptions] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    getSamplesOptions()
      .then((options) => {
        if (!isActive) return;
        setProjectsOptions(options.projects);
        setClientsOptions(options.clients);
      })
      .catch((error) => {
        console.error("Failed to load sample options:", error);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const connectorOptions = React.useMemo(() => {
    if (!masterData?.connectors) return [];
    return Object.keys(masterData.connectors).sort();
  }, [masterData]);

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
