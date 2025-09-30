import { ActionIcon, Group, Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getClientsDto, type GetClientsDto } from "@bmb-inc/types";
import { SearchBy } from "./SearchBy";
// Removed custom params hook in favor of react-router's useSearchParams

interface ClientSearchProps {
  isLoading: boolean;
  error: string | undefined;
}

type SearchKey = Exclude<keyof GetClientsDto, 'clientId'>;

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const schemaKeys = getClientsDto.keyof().options as readonly (keyof GetClientsDto)[];
  const searchKeys: SearchKey[] = schemaKeys.filter((k): k is SearchKey => k !== 'clientId');
  // Determine initial key and value from URL
  const [searchKey, setSearchKey] = useState<SearchKey>(() => {
    // Prefer the first key from the schema that exists in URL; otherwise fall back to the first allowed key
    const found = searchKeys.find(k => !!searchParams.get(k as string));
    return (found ?? searchKeys[0] ?? 'clientCode') as SearchKey;
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get((searchKeys.find(k => !!searchParams.get(k as string)) ?? 'clientCode') as string) ?? '');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  // Update URL params; when input empty remove only search keys, otherwise set on debounce
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        for (const key of searchKeys) params.delete(key);
        return params;
      });
      return;
    }
    setSearchParams(prev => {
      const trimmed = debouncedSearchQuery.trim();
      const params = new URLSearchParams(prev);
      // Ensure only the active key exists among all allowed keys
      for (const key of searchKeys) {
        if (key !== searchKey) params.delete(key);
      }
      if (trimmed) params.set(searchKey, trimmed);
      return params;
    });
  }, [searchQuery, debouncedSearchQuery, searchKey, setSearchParams]);

  // Keep local state in sync if URL changes externally (navigation)
  useEffect(() => {
    const value = searchParams.get(searchKey) ?? '';
    if (value !== searchQuery) setSearchQuery(value);
  }, [searchParams, searchKey]);

  return (
      <Group gap="xs" align="stretch">
        <SearchBy searchKey={searchKey} setSearchKey={setSearchKey} />
        <TextInput
          flex={1}
          placeholder={searchKey === 'clientCode' ? 'Search by client code...' : 'Search by client name...'} 
          error={error}
          leftSection={<IconSearch />} 
          rightSection={isLoading ? <Loader size="xs" color="blue" /> : searchQuery ? <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={() => {
            // Immediate clear: input + URL params → empty state
            setSearchQuery('');
            setSearchParams(new URLSearchParams());
          }}><IconX /></ActionIcon> : undefined} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Group>
  );
};
