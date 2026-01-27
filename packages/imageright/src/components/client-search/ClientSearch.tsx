import { ActionIcon, Group, Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { useQueryState, useQueryStates, parseAsInteger, parseAsString } from "nuqs";

interface ClientSearchProps {
  isLoading: boolean;
  error: string | undefined;
}

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const [clientCodeParam, setClientCodeParam] = useQueryState('clientCode', parseAsString);
  const [clientNameParam, setClientNameParam] = useQueryState('clientName', parseAsString);
  const [, setNavParams] = useQueryStates({
    clientId: parseAsInteger,
    folderId: parseAsInteger,
    documentId: parseAsInteger,
    expanded: parseAsString,
  });
  const [clientCode, setClientCode] = useState(clientCodeParam ?? '');
  const [clientName, setClientName] = useState(clientNameParam ?? '');
  const updateClientCodeParam = useDebouncedCallback((value: string) => {
    setClientCodeParam(value.trim() ? value : null);
  }, 300);
  const updateClientNameParam = useDebouncedCallback((value: string) => {
    setClientNameParam(value.trim() ? value : null);
  }, 300);

  useEffect(() => {
    setClientCode(clientCodeParam ?? '');
  }, [clientCodeParam]);

  useEffect(() => {
    setClientName(clientNameParam ?? '');
  }, [clientNameParam]);

  // Clear navigation params when no search input is present
  useEffect(() => {
    const hasQuery = clientCode.trim() || clientName.trim();
    if (!hasQuery) {
      setNavParams({ clientId: null, folderId: null, documentId: null, expanded: null }, { history: 'push' });
    }
  }, [clientCode, clientName, setNavParams]);

  const handleClearCode = () => {
    setClientCode('');
    setClientCodeParam(null);
    updateClientCodeParam.cancel();
  };

  const handleClearName = () => {
    setClientName('');
    setClientNameParam(null);
    updateClientNameParam.cancel();
  };

  return (
    <Group gap="xs" align="stretch">
      <TextInput
        flex={1}
        placeholder="Search by client code..."
        error={error}
        leftSection={<IconSearch />}
        rightSection={
          isLoading && clientCode ? (
            <Loader size="xs" color="blue" />
          ) : clientCode ? (
            <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={handleClearCode}>
              <IconX />
            </ActionIcon>
          ) : undefined
        }
        value={clientCode}
        onChange={(e) => {
          const nextValue = e.target.value;
          setClientCode(nextValue);
          if (!nextValue.trim()) {
            updateClientCodeParam.cancel();
            setClientCodeParam(null);
            return;
          }
          updateClientCodeParam(nextValue);
        }}
      />
      <TextInput
        flex={1}
        placeholder="Search by client name..."
        error={error}
        leftSection={<IconSearch />}
        rightSection={
          isLoading && clientName ? (
            <Loader size="xs" color="blue" />
          ) : clientName ? (
            <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={handleClearName}>
              <IconX />
            </ActionIcon>
          ) : undefined
        }
        value={clientName}
        onChange={(e) => {
          const nextValue = e.target.value;
          setClientName(nextValue);
          if (!nextValue.trim()) {
            updateClientNameParam.cancel();
            setClientNameParam(null);
            return;
          }
          updateClientNameParam(nextValue);
        }}
      />
    </Group>
  );
};
