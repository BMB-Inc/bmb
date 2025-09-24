import { useClients } from "@hooks/index";
import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from '@tabler/icons-react';
import { useState } from "react";

export const ClientSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const { data, isLoading, error } = useClients(debouncedSearchQuery, debouncedSearchQuery);

  return <TextInput placeholder="Search clients..." leftSection={<IconSearch />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data={data?.map((client: any) => ({
    value: client.CLIENT_CODE,
    label: client.CLIENT_NAME,
  }))} />
};
