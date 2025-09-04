// Client Search Exports
export { ClientSearch } from './components/client-search';
export { 
  ClientSearchForm,
  type ClientSearchFormProps,
  type ClientFormValues,
  type FormValues
} from './components/client-search-form';
export { FormExample } from './components/form-example';

// Client Search Hooks
export { useGetClients } from './hooks/useGetClients';
export { useGetClientById } from './hooks/useGetClientById';

// Client Search API
export { getClients, getClientById } from './api/clients/route';

// Staff Search Exports
export { StaffSearch } from './components/staff-search';
export { SearchFieldSelector } from './components/search-field-selector';

// Staff Search Types and Schemas
export type { SearchField } from './schemas/search-fields.schema';
export { searchFieldOptions, SearchFieldSchema } from './schemas/search-fields.schema';

// Staff Search Hooks
export { useStaffUrlParams } from './hooks/useStaffUrlParams';
export { useStaffSearch } from './hooks/useStaffSearch';
export { useStaffDataTransform } from './hooks/useStaffDataTransform';
export { useGetStaff } from './hooks/useGetStaff';

// Staff Search API
export { getStaff } from './api/staff/route';

// Re-export types from @mantine/form for client search
// This approach allows consumers to use these types without directly importing from @mantine/form
export type { UseFormReturnType } from '@mantine/form';
