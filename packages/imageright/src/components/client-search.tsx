import { ActionIcon, Group, Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBySelect } from "./search-by-select";
// Removed custom params hook in favor of react-router's useSearchParams

interface ClientSearchProps {
  isLoading: boolean;
  error: string | undefined;
}

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Determine initial key and value from URL
  const [searchKey, setSearchKey] = useState<'clientCode' | 'clientName'>(() => {
    const hasClientName = !!searchParams.get('clientName');
    return hasClientName ? 'clientName' : 'clientCode';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    const initialValue = searchParams.get('clientName') ?? searchParams.get('clientCode') ?? '';
    return initialValue;
  });
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  // Update URL params when the debounced query changes
  useEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const trimmed = debouncedSearchQuery.trim();
      const otherKey = searchKey === 'clientCode' ? 'clientName' : 'clientCode';
      // Ensure only the active key exists
      params.delete(otherKey);
      if (trimmed) params.set(searchKey, trimmed); else params.delete(searchKey);
      return params;
    });
  }, [debouncedSearchQuery, searchKey, setSearchParams]);

  // Keep local state in sync if URL changes externally (navigation)
  useEffect(() => {
    const value = searchParams.get(searchKey) ?? '';
    if (value !== searchQuery) setSearchQuery(value);
  }, [searchParams, searchKey]);

  return (
      <Group gap="xs" align="stretch">
        <SearchBySelect searchKey={searchKey} setSearchKey={setSearchKey} />
        <TextInput
          flex={1}
          placeholder={searchKey === 'clientCode' ? 'Search by client code...' : 'Search by client name...'} 
          error={error}
          leftSection={<IconSearch />} 
          rightSection={isLoading ? <Loader size="xs" color="blue" /> : searchQuery ? <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={() => {
            setSearchQuery('');
          }}><IconX /></ActionIcon> : undefined} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Group>
  );
};
