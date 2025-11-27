import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { MasterData } from "../types";

export interface EntityResolverContext {
  stockCache: Record<string, number>;
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
  const { stockCache } = useAppSelector((state) => state.stock);
  const masterData = useAppSelector((state) => state.masterData.data);

  const entity = useMemo(() => {
    if (!id) return null;
    try {
      return resolver(id, { stockCache, masterData });
    } catch (error) {
      console.error("Failed to resolve entity", error);
      return null;
    }
  }, [id, stockCache, masterData, resolver]);

  return { entity, id, stockCache };
};

