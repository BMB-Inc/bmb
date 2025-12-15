import { useEffect, useState } from "react";
import { getPages } from "@api/index";
import { type ImagerightPageParams } from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";

export const usePages = (params?: ImagerightPageParams) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<Awaited<ReturnType<typeof getPages>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!params?.documentId;

  useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getPages(params, baseUrl)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params?.documentId, baseUrl]);

  return { data, isLoading, error } as const;
};
