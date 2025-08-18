// Export components
export { ClientSearch } from './components/client-search';
export { ClientSearchForm } from './components/client-search-form';

// Export types
export interface ClientSearchFormProps {
  form: any; // Using any here since we don't want to export Mantine form types
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  [key: string]: any;
}
