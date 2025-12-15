import { useEffect, useState } from "react";
import { getClients } from "@api/index";
import { useQueryStates, parseAsString } from "nuqs";
import { useImageRightConfig } from "../context/ImageRightContext";

export const useClients = () => {
  const { baseUrl } = useImageRightConfig();
  const [{ clientCode, clientName }] = useQueryStates({
    clientCode: parseAsString,
    clientName: parseAsString,
  });

  const code = (clientCode ?? '').trim();
  const name = (clientName ?? '').trim();
  const hasSearchQuery = !!code || !!name;

  const [data, setData] = useState<Awaited<ReturnType<typeof getClients>> | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!hasSearchQuery) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getClients({ ...(code && { clientCode: code }), ...(name && { clientName: name }) }, baseUrl)
      .then((res) => { if (!cancelled) setData(res ?? []); })
      .catch((err: unknown) => { if (!cancelled) setError(err as Error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [code, name, hasSearchQuery, baseUrl]);

  return { data, isLoading, error } as const;
}
