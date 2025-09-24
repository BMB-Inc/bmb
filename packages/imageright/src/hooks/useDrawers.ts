import { getDrawers } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export const useDrawers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["drawers"],
    queryFn: getDrawers,
  });
  return { data, isLoading, error };
}