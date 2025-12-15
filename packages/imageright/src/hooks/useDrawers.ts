import { useEffect, useState } from "react";
import { getDrawers } from "@api/index";
import { useImageRightConfig } from "../context/ImageRightContext";

export const useDrawers = () => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDrawers>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDrawers(baseUrl)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [baseUrl]);

  return { data, isLoading, error } as const;
}
