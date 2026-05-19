import { getAnaliseTab } from "@/api/samplesApi";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { useEffect, useState } from "react";

export default function useData() {
  const [rows, setRows] = useState<AnaliseTabDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAnaliseTab();
      setRows(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch AnaliseTab data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { rows, loading, error, setRows, refresh: load };
}
