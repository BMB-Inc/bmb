// Client Search Exports
export { ClientSearch } from './client-search/components/client-search';
export { 
  ClientSearchForm,
  type ClientSearchFormProps,
  type ClientFormValues,
  type FormValues
} from './client-search/components/client-search-form';
export { FormExample } from './client-search/components/form-example';

// Client Search Hooks
export { useGetClients } from './client-search/hooks/useGetClients';
export { useGetClientById } from './client-search/hooks/useGetClientById';

// Client Search API
export { getClients, getClientById } from './client-search/api/clients';

// Staff Search Exports
export { StaffSearch } from './staff-search/components/staff-search';
export { SearchFieldSelector } from './staff-search/components/search-field-selector';

// Staff Search Types and Schemas
export type { SearchField } from './staff-search/schemas/search-fields.schema';
export { searchFieldOptions, SearchFieldSchema } from './staff-search/schemas/search-fields.schema';

// Staff Search Hooks
export { useStaffUrlParams } from './staff-search/hooks/useStaffUrlParams';
export { useStaffSearch } from './staff-search/hooks/useStaffSearch';
export { useStaffDataTransform } from './staff-search/hooks/useStaffDataTransform';
export { useGetStaff } from './staff-search/hooks/useGetStaff';

// Staff Search API
export { getStaff } from './staff-search/api/route';

// Re-export types from @mantine/form for client search
// This approach allows consumers to use these types without directly importing from @mantine/form
export type { UseFormReturnType } from '@mantine/form';
