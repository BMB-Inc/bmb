// Export the main component
export { StaffSearch } from './components/staff-search';

// Export types and schemas
export type { SearchField } from './schemas/search-fields.schema';
export { searchFieldOptions } from './schemas/search-fields.schema';

// Export hooks for advanced usage
export { useStaffUrlParams } from './hooks/useStaffUrlParams';
export { useStaffSearch } from './hooks/useStaffSearch';
export { useStaffDataTransform } from './hooks/useStaffDataTransform';
