import { useEffect, useState } from "react";
import { getWorkflows, getWorkflowSteps } from "@api/index";
import {
  type GetWorkflowsDto,
  type GetWorkflowStepsDto,
  type ImagerightWorkflow,
  type ImagerightWorkflowStep,
} from "@bmb-inc/types";
import { useImageRightConfig } from "../context/ImageRightContext";

/**
 * Hook to fetch all workflows
 */
export const useWorkflows = (params?: GetWorkflowsDto, enabled = true) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<ImagerightWorkflow[] | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    getWorkflows(params, baseUrl)
      .then((res) => {
        if (!cancelled) {
          setData(res as ImagerightWorkflow[]);
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
  }, [params?.includeBuddies, baseUrl, enabled]);

  return { data, isLoading, error } as const;
};

/**
 * Hook to fetch workflow steps for a specific workflow
 * Only fetches when workflowId is provided and enabled is true
 */
export const useWorkflowSteps = (
  workflowId: number | undefined,
  params?: GetWorkflowStepsDto,
  enabled = true
) => {
  const { baseUrl } = useImageRightConfig();
  const [data, setData] = useState<ImagerightWorkflowStep[] | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const shouldFetch = enabled && workflowId !== undefined;

  useEffect(() => {
    if (!shouldFetch || workflowId === undefined) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    getWorkflowSteps(workflowId, params, baseUrl)
      .then((res) => {
        if (!cancelled) {
          setData(res as ImagerightWorkflowStep[]);
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
  }, [workflowId, params?.includeBuddies, params?.flag, baseUrl, shouldFetch]);

  return { data, isLoading, error } as const;
};
