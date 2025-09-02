import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../api/route";
import type { Staff } from '@bmb-inc/types';

export const useGetStaff = (staffCode?: string, staffName?: string, staffId?: number, divisionNo?: string, email?: string) => {
  const { data: staffData, isLoading, error } = useQuery<Staff[]>({
    queryKey: ["staff", staffCode, staffName, staffId, divisionNo, email],
    queryFn: async () => {
      const result = await getStaff(staffCode, staffName, staffId, divisionNo, email);
      return result;
    },
    enabled: !!staffCode || !!staffName || !!staffId || !!divisionNo || !!email,
    staleTime: 30000, // 30 seconds
  });
  return { staffData: staffData || [], isLoading, error };
};