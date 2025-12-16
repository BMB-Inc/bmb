import { useEffect, useState, useCallback } from "react";
import { getTasks, findTasks, getFileTasks } from "@api/index";
import {
  type GetTasksDto,
  type FindTasksQueryDto,
  type FindTasksBodyDto,
  type GetFileTasksDto,
  type ImagerightTask,
  type ImagerightTaskResponse,
} from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";

/**
 * Hook to fetch tasks with pagination and filtering
 */
export const useTasks = (params?: GetTasksDto) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<ImagerightTaskResponse | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!params;

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
    getTasks(params, baseUrl)
      .then((res) => {
        if (!cancelled) {
          setData(res as ImagerightTaskResponse);
        }
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
  }, [JSON.stringify(params), baseUrl, enabled]);

  return { data, isLoading, error } as const;
};

/**
 * Hook to find tasks with advanced filtering (POST request)
 */
export const useFindTasks = (
  queryParams?: FindTasksQueryDto,
  bodyParams?: FindTasksBodyDto
) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<ImagerightTaskResponse | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!bodyParams;

  const refetch = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const combinedParams = { ...queryParams, ...bodyParams };
      const res = await findTasks(combinedParams, baseUrl);
      setData(res as ImagerightTaskResponse);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(queryParams), JSON.stringify(bodyParams), baseUrl, enabled]);

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
    const combinedParams = { ...queryParams, ...bodyParams };
    findTasks(combinedParams, baseUrl)
      .then((res) => {
        if (!cancelled) {
          setData(res as ImagerightTaskResponse);
        }
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
  }, [JSON.stringify(queryParams), JSON.stringify(bodyParams), baseUrl, enabled]);

  return { data, isLoading, error, refetch } as const;
};

/**
 * Hook to fetch tasks for a specific file
 */
export const useFileTasks = (params?: GetFileTasksDto) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<ImagerightTask[] | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = !!params?.fileId;

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
    getFileTasks(params, baseUrl)
      .then((res) => {
        if (!cancelled) {
          setData(res as ImagerightTask[]);
        }
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
  }, [params?.fileId, JSON.stringify(params), baseUrl, enabled]);

  return { data, isLoading, error } as const;
};


