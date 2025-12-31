import { ActionIcon, Group, Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useQueryState, parseAsString } from "nuqs";

interface ClientSearchProps {
  isLoading: boolean;
  error: string | undefined;
}

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const [clientCode, setClientCode] = useQueryState('clientCode', parseAsString);
  const [clientName, setClientName] = useQueryState('clientName', parseAsString);

  // Local state for each input
  const [codeQuery, setCodeQuery] = useState(() => clientCode ?? '');
  const [nameQuery, setNameQuery] = useState(() => clientName ?? '');

  // Debounce each input separately
  const [debouncedCodeQuery] = useDebouncedValue(codeQuery, 500);
  const [debouncedNameQuery] = useDebouncedValue(nameQuery, 500);

  // Update URL parameters for client code
  useEffect(() => {
    const trimmed = debouncedCodeQuery.trim();
    setClientCode(trimmed || null);
  }, [debouncedCodeQuery, setClientCode]);

  // Update URL parameters for client name
  useEffect(() => {
    const trimmed = debouncedNameQuery.trim();
    setClientName(trimmed || null);
  }, [debouncedNameQuery, setClientName]);

  // Sync local inputs when URL changes externally
  useEffect(() => {
    if ((clientCode ?? '') !== codeQuery) setCodeQuery(clientCode ?? '');
  }, [clientCode]);

  useEffect(() => {
    if ((clientName ?? '') !== nameQuery) setNameQuery(clientName ?? '');
  }, [clientName]);

  const handleClearCode = () => {
    setCodeQuery('');
    setClientCode(null);
  };

  const handleClearName = () => {
    setNameQuery('');
    setClientName(null);
  };

  return (
    <Group gap="xs" align="stretch">
      <TextInput
        flex={1}
        placeholder="Search by client code..."
        error={error}
        leftSection={<IconSearch />}
        rightSection={
          isLoading && codeQuery ? (
            <Loader size="xs" color="blue" />
          ) : codeQuery ? (
            <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={handleClearCode}>
              <IconX />
            </ActionIcon>
          ) : undefined
        }
        value={codeQuery}
        onChange={(e) => setCodeQuery(e.target.value)}
      />
      <TextInput
        flex={1}
        placeholder="Search by client name..."
        error={error}
        leftSection={<IconSearch />}
        rightSection={
          isLoading && nameQuery ? (
            <Loader size="xs" color="blue" />
          ) : nameQuery ? (
            <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={handleClearName}>
              <IconX />
            </ActionIcon>
          ) : undefined
        }
        value={nameQuery}
        onChange={(e) => setNameQuery(e.target.value)}
      />
    </Group>
  );
};
