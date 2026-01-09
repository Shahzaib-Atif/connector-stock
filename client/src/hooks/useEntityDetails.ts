import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { MasterData } from "../utils/types";

export interface EntityResolverContext {
  masterData: MasterData | null;
}

export type EntityResolver<T> = (
  id: string,
  ctx: EntityResolverContext
) => T | null;

// Shared loader wires params, store, parsing.
// Keeps screens focused on rendering.
export const useEntityDetails = <T>(resolver: EntityResolver<T>) => {
  const { id } = useParams<{ id: string }>();
  const masterData = useAppSelector((state) => state.masterData.data);

  const entity = useMemo(() => {
    if (!id) return null;
    try {
      return resolver(id, { masterData });
    } catch (error) {
      console.error("Failed to resolve entity", error);
      return null;
    }
  }, [id, masterData, resolver]);

  return { entity, id };
};
