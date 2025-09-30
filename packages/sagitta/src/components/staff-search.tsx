import { Group, Loader, Select, type SelectProps } from '@mantine/core';
import { useGetStaff } from '../hooks/useGetStaff';
import { IconSearch } from '@tabler/icons-react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useStaffUrlParams } from '../hooks/useStaffUrlParams';
import { useStaffDataTransform } from '../hooks/useStaffDataTransform';
import { useStaffSearch } from '../hooks/useStaffSearch';
import { SearchFieldSelector } from './search-field-selector';
import type { SearchField } from '../schemas/search-fields.schema';
import { searchFieldOptions } from '../schemas/search-fields.schema';

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
  const [debouncedQuery] = useDebouncedValue(searchQuery, 800);
  const [searchField, setSearchField] = useState<SearchField>('staffCode');
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
    return transformStaffToOptions(searchResults);
  }, [searchResults, transformStaffToOptions]);
  
  // Memoize the selected staff and combined options
  const selectedStaff = selectedStaffData?.[0];
  const combinedOptions = useMemo(() => {
    return combineStaffOptions(searchOptions, selectedStaff);
  }, [searchOptions, selectedStaff, combineStaffOptions]);

  // Memoize the placeholder text
  const placeholderText = useMemo(() => 
    placeholder || `Search by ${searchFieldOptions.find(option => option.value === searchField)?.label}`,
    [placeholder, searchField]
  );
  
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

  // Auto-select when the search yields exactly one result
  useEffect(() => {
    if (isLoading || isLoadingSelected) return;
    if (!debouncedQuery || debouncedQuery.trim().length === 0) return;
    if (searchOptions.length !== 1) return;

    const only = searchOptions[0];
    let value: string | null = null;

    if (typeof only === 'string') {
      value = only;
    } else if (only && typeof only === 'object') {
      if ('items' in only) return; // It's a group, ignore
      if ('value' in only && typeof only.value === 'string') {
        value = only.value;
      }
    }

    if (value && value !== selectedStaffCode) {
      handleSelectionChange(value);
    }
  }, [searchOptions, isLoading, isLoadingSelected, debouncedQuery, selectedStaffCode, handleSelectionChange]);



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
        leftSection={<IconSearch />}
        rightSection={(isLoading || isLoadingSelected) ? <Loader size="xs" /> : null}
        searchable
        clearable
        onSearchChange={(query) => {
          // Don't clear search results when the component clears the input after selection
          if (query !== '' || combinedOptions.length === 0) {
            handleSearchChange(query);
          }
        }}
        filter={({ options }) => options} // Disable built-in filtering since we handle it via API
        value={selectedStaffCode}
        onChange={handleSelectionChange}
        style={{ flex: 1 }}
        {...rest}
      />
    </Group>
  );
}

export { StaffSearch };
