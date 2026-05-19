import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAnaliseThunk,
  refreshAnaliseThunk,
} from "@/store/slices/analiseSlice";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { useEffect, useState } from "react";

export default function useData() {
  const dispatch = useAppDispatch();
  const { rows: storeRows, loading, error, hasLoaded } = useAppSelector(
    (state) => state.analise,
  );
  const [rows, setRows] = useState<AnaliseTabDto[]>([]);

  useEffect(() => {
    if (!hasLoaded && !loading) {
      dispatch(fetchAnaliseThunk());
    }
  }, [dispatch, hasLoaded, loading]);

  useEffect(() => {
    setRows(storeRows);
  }, [storeRows]);

  const refresh = () => dispatch(refreshAnaliseThunk());

  return { rows, setRows, loading, error, refresh };
}
