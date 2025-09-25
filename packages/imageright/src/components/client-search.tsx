import { ActionIcon, Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// Removed custom params hook in favor of react-router's useSearchParams

interface ClientSearchProps {
  isLoading: boolean;
  error: string | undefined;
}

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('clientCode') ?? '');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  // Update URL params when the debounced query changes
  useEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      const trimmed = debouncedSearchQuery.trim();
      if (trimmed) {
        params.set('clientCode', trimmed);
      } else {
        params.delete('clientCode');
      }
      return params;
    });
  }, [debouncedSearchQuery, setSearchParams]);

  return (
      <TextInput
        flex={1}
        placeholder="Search by client code..." 
        error={error}
        leftSection={<IconSearch />} 
        rightSection={isLoading ? <Loader size="xs" color="blue" /> : searchQuery ? <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={() => {
          setSearchQuery('');
          setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('clientCode');
            return params;
          });
        }}><IconX /></ActionIcon> : undefined} 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
  );
};
