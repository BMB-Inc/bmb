import { useEffect, useState } from "react";
import { getDocumentById, getDocuments } from "@api/index";
import { type ImagerightDocumentParams } from "@bmb-inc/types";
import { DocumentTypes } from "@bmb-inc/types";

export const useDocuments = (params?: ImagerightDocumentParams, documentType?: DocumentTypes) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDocuments>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!params?.folderId;

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
    getDocuments(params, documentType)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params?.clientId, params?.folderId, documentType]);

  return { data, isLoading, error } as const;
}

export const useDocumentById = (id: number) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDocumentById>> | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getDocumentById(id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading, error } as const;
}