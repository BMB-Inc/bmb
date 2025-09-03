import { useGetStaff } from './useGetStaff';
import type { SearchField } from '../schemas/search-fields.schema';
import { ExpenseDivisionGLCodes } from '@bmb-inc/types';

export function useStaffSearch(
  searchField: SearchField,
  query: string,
  enabled: boolean = true,
  baseUrl?: string
) {
  // Check if the search field is a division
  const isDivisionField = searchField in ExpenseDivisionGLCodes;
  
  // For division fields, we don't need a query - just fetch all staff from that division
  const shouldFetch = enabled && (isDivisionField || query.trim().length > 0);
  
  const queryParams = {
    staffCode: searchField === 'staffCode' ? query : undefined,
    staffName: searchField === 'staffName' ? query : undefined,
    email: searchField === 'email' ? query : undefined,
    // If it's a division field, use the division code from the enum
    division: isDivisionField ? ExpenseDivisionGLCodes[searchField as keyof typeof ExpenseDivisionGLCodes]?.toString() : undefined,
  };

  return useGetStaff(
    shouldFetch ? queryParams.staffCode : undefined,
    shouldFetch ? queryParams.staffName : undefined,
    shouldFetch ? queryParams.division : undefined,
    shouldFetch ? queryParams.email : undefined,
    baseUrl
  );
}
