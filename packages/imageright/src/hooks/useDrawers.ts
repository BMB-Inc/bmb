import { useEffect, useState } from "react";
import { getDrawers } from "@api/index";

export const useDrawers = () => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDrawers>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDrawers()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { data, isLoading, error } as const;
}