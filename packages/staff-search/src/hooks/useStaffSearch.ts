import { useGetStaff } from './useGetStaff';
import type { SearchField } from '../schemas/search-fields.schema';

export function useStaffSearch(
  searchField: SearchField,
  query: string,
  enabled: boolean = true
) {
  // Only fetch if there's a search query and it's enabled
  const shouldFetch = enabled && query.trim().length > 0;
  
  const queryParams = {
    staffCode: searchField === 'staffCode' ? query : undefined,
    staffName: searchField === 'staffName' ? query : undefined,
    email: searchField === 'email' ? query : undefined,
    divisionNo: searchField === 'divisionNo' ? query : undefined,
  };

  return useGetStaff(
    shouldFetch ? queryParams.staffCode : undefined,
    shouldFetch ? queryParams.staffName : undefined,
    undefined, // staffId - not using in search
    shouldFetch ? queryParams.divisionNo : undefined,
    shouldFetch ? queryParams.email : undefined
  );
}
