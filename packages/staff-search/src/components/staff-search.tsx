import { Group, Loader, Select, type SelectProps } from '@mantine/core';
import { useGetStaff } from '../hooks/useGetStaff';
import { IconSearch } from '@tabler/icons-react';
import { useState, useCallback, useMemo } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useStaffUrlParams } from '../hooks/useStaffUrlParams';
import { useStaffDataTransform } from '../hooks/useStaffDataTransform';
import { useStaffSearch } from '../hooks/useStaffSearch';
import { SearchFieldSelector } from './search-field-selector';
import type { SearchField } from '../schemas/search-fields.schema';
import { searchFieldOptions } from '../schemas/search-fields.schema';
import { ExpenseDivisionGLCodes } from '@bmb-inc/types';

interface StaffSearchProps extends Omit<SelectProps, 'onChange'> {
  label?: string;
  placeholder?: string;
  onChange?: (value: string | null) => void;
  showParamsSelection?: boolean;
  baseUrl?: string;
}

function StaffSearch({ label, placeholder, onChange, showParamsSelection = true, baseUrl, ...rest }: StaffSearchProps) { 
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [searchField, setSearchField] = useState<SearchField>('staffName');
  const [error, setError] = useState<Error | null>(null);
  
  // Custom hooks for URL params and data transformation
  const { staffCode: selectedStaffCode, updateStaffCode } = useStaffUrlParams();
  const { transformStaffToOptions, combineStaffOptions } = useStaffDataTransform();
  
  // Fetch the selected staff data when the component mounts or URL changes
  const { 
    staffData: selectedStaffData, 
    isLoading: isLoadingSelected,
    error: selectedStaffError
  } = useGetStaff(
    selectedStaffCode || undefined, 
    undefined, 
    undefined, 
    undefined,
    baseUrl
  );
  
  // Use the custom search hook for searching staff
  const { 
    staffData: searchResults, 
    isLoading,
    error: searchError 
  } = useStaffSearch(searchField, debouncedQuery, true, baseUrl);
  
  // Handle errors from both API calls
  useMemo(() => {
    if (searchError) setError(searchError);
    else if (selectedStaffError) setError(selectedStaffError);
    else setError(null);
  }, [searchError, selectedStaffError]);
  
  // Memoize transformed search options
  const searchOptions = useMemo(() => {
    console.log("Search Results:", searchResults);
    const options = transformStaffToOptions(searchResults);
    console.log("Transformed Options:", options);
    return options;
  }, [searchResults, transformStaffToOptions]);
  
  // Memoize the selected staff and combined options
  const selectedStaff = selectedStaffData?.[0];
  const combinedOptions = useMemo(() => {
    console.log("Selected Staff:", selectedStaff);
    const combined = combineStaffOptions(searchOptions, selectedStaff);
    console.log("Final Combined Options:", combined);
    return combined;
  }, [searchOptions, selectedStaff, combineStaffOptions]);

  // Check if the current search field is a division
  const isDivisionField = searchField in ExpenseDivisionGLCodes;
  
  // Memoize the placeholder text
  const placeholderText = useMemo(() => {
    if (placeholder) return placeholder;
    if (isDivisionField) return `All staff in ${searchField}`;
    return `Search by ${searchFieldOptions.find(option => option.value === searchField)?.label}`;
  }, [placeholder, searchField, isDivisionField]);
  
  // Use callbacks for event handlers to prevent unnecessary rerenders
  const handleFieldChange = useCallback((field: SearchField) => {
    setSearchField(field);
  }, []);
  
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  const handleSelectionChange = useCallback((value: string | null) => {
    updateStaffCode(value);
    if (onChange) {
      onChange(value);
    }
  }, [updateStaffCode, onChange]);

  console.log("About to render Select with data:", combinedOptions);
  console.log("Data structure:", JSON.stringify(combinedOptions, null, 2));
  console.log("Loading states - isLoading:", isLoading, "isLoadingSelected:", isLoadingSelected);
  console.log("Search query:", searchQuery, "Debounced query:", debouncedQuery);

  return (
    <Group gap='xs' align="end">
      {showParamsSelection && (
        <SearchFieldSelector 
          onFieldChange={handleFieldChange}
        />
      )}
      <Select
        label={label}
        placeholder={placeholderText}
        data={combinedOptions}
        nothingFoundMessage="No staff found"
        error={error?.message}
        leftSection={!isDivisionField ? <IconSearch /> : undefined}
        rightSection={(isLoading || isLoadingSelected) ? <Loader size="xs" /> : null}
        searchable={!isDivisionField}
        clearable
        onSearchChange={!isDivisionField ? (query) => {
          console.log("Search query changed:", query);
          handleSearchChange(query);
        } : undefined}
        searchValue={!isDivisionField ? searchQuery : undefined}
        value={selectedStaffCode}
        onChange={handleSelectionChange}
        style={{ flex: 1 }}
        {...rest}
      />
    </Group>
  );
}

export { StaffSearch };