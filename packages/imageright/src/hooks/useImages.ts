import { useEffect, useState } from 'react';
import { getImages } from '@api/index';

export const useImages = (pageId: number, imageId: number, version?: number) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getImages>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!pageId && !!imageId;

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
    getImages(pageId, imageId, version)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pageId, imageId, version]);

  return { data, isLoading, error } as const;
}