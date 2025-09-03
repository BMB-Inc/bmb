import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../api/route";
import type { Staff } from '@bmb-inc/types';

export const useGetStaff = (staffCode?: string, staffName?: string, division?: string, email?: string, baseUrl?: string) => {
  const { data: staffData, isLoading, error } = useQuery<Staff[]>({
    queryKey: ["staff", staffCode, staffName, division, email, baseUrl],
    queryFn: async () => {
      const result = await getStaff(staffCode, staffName, division, email, baseUrl);
      console.log("API Response:", result);
      return result;
    },
    enabled: !!staffCode || !!staffName || !!division || !!email,
    staleTime: 30000, // 30 seconds
  });
  return { staffData: staffData || [], isLoading, error };
};