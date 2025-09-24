import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = useCallback((key: string, value: string | number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(key, value.toString());
      return newParams;
    });
  }, [setSearchParams]);

  const removeParam = useCallback((key: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(key);
      return newParams;
    });
  }, [setSearchParams]);

  const getParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  const clearAllParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    setParam,
    removeParam,
    getParam,
    clearAllParams,
    searchParams
  };
};
