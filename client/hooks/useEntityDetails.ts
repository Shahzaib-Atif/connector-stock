import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export interface EntityResolverContext {
  stockCache: Record<string, number>;
}

export type EntityResolver<T> = (
  id: string,
  ctx: EntityResolverContext
) => T | null;

// Shared loader wires params, store, parsing.
// Keeps screens focused on rendering.
export const useEntityDetails = <T>(resolver: EntityResolver<T>) => {
  const { id } = useParams<{ id: string }>();
  const stockCache = useAppSelector((state) => state.stock.stockCache);

  const entity = useMemo(() => {
    if (!id) return null;
    try {
      return resolver(id, { stockCache });
    } catch (error) {
      console.error("Failed to resolve entity", error);
      return null;
    }
  }, [id, stockCache, resolver]);

  return { entity, id, stockCache };
};

