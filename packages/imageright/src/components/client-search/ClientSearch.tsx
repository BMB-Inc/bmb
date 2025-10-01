import { ActionIcon, Group, Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { getClientsDto, type GetClientsDto } from "@bmb-inc/types";
import { SearchBy } from "./SearchBy";
// Removed custom params hook in favor of react-router's useSearchParams

interface ClientSearchProps {
  isLoading: boolean;
  error: string | undefined;
}

type SearchKey = Exclude<keyof GetClientsDto, 'clientId'>;

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const schemaKeys = getClientsDto.keyof().options as readonly (keyof GetClientsDto)[];
  const searchKeys: SearchKey[] = schemaKeys.filter((k): k is SearchKey => k !== 'clientId');

  const [clientCode, setClientCode] = useQueryState('clientCode', parseAsString);
  const [clientName, setClientName] = useQueryState('clientName', parseAsString);

  // Determine initial key and value from URL
  const [searchKey, setSearchKey] = useState<SearchKey>(() => (clientCode ? 'clientCode' : clientName ? 'clientName' : (searchKeys[0] ?? 'clientCode')) as SearchKey);
  const [searchQuery, setSearchQuery] = useState(() => clientCode ?? clientName ?? '');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  // Write to URL based on active key; keep only one key populated
  useEffect(() => {
    const trimmed = debouncedSearchQuery.trim();
    if (!trimmed) {
      setClientCode(null);
      setClientName(null);
      return;
    }
    if (searchKey === 'clientCode') {
      setClientCode(trimmed);
      setClientName(null);
    } else {
      setClientName(trimmed);
      setClientCode(null);
    }
  }, [debouncedSearchQuery, searchKey, setClientCode, setClientName]);

  // Sync local input when URL changes externally
  useEffect(() => {
    const next = searchKey === 'clientCode' ? (clientCode ?? '') : (clientName ?? '');
    if (next !== searchQuery) setSearchQuery(next);
  }, [clientCode, clientName, searchKey]);

  return (
      <Group gap="xs" align="stretch">
        <SearchBy searchKey={searchKey} setSearchKey={setSearchKey} />
        <TextInput
          flex={1}
          placeholder={searchKey === 'clientCode' ? 'Search by client code...' : 'Search by client name...'} 
          error={error}
          leftSection={<IconSearch />} 
          rightSection={isLoading ? <Loader size="xs" color="blue" /> : searchQuery ? <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={() => {
            setSearchQuery('');
            setClientCode(null);
            setClientName(null);
          }}><IconX /></ActionIcon> : undefined} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Group>
  );
};
