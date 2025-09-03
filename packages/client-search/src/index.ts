// Export components
export { ClientSearch } from './components/client-search';
export { 
  ClientSearchForm,
  type ClientSearchFormProps,
  type ClientFormValues,
  type FormValues
} from './components/client-search-form';
export { FormExample } from './components/form-example';

// Re-export types from @mantine/form
// This approach allows consumers to use these types without directly importing from @mantine/form
export type { UseFormReturnType } from '@mantine/form';
