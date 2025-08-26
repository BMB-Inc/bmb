import type { ClientsSchema } from "@bmb-inc/types";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetClients } from "../hooks/useGetClients";
import { Select, SelectProps, Tooltip } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Loader } from "@mantine/core";

interface ClientSearchProps extends Omit<SelectProps, 'data' | 'onChange' | 'value'> {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  withTooltip?: boolean;
}

export const ClientSearch = ({withTooltip = false, ...props}: ClientSearchProps) => {
  // State for search and selection
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const [selectedClient, setSelectedClient] = useState<ClientsSchema | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  
  // Only fetch when actively searching and no client is selected
  const shouldFetch = !selectedClient && debouncedSearchQuery && debouncedSearchQuery.length > 0;
  const { data, isLoading, error } = useGetClients(shouldFetch ? debouncedSearchQuery : "");

  // Convert client data to select options format
  const clientOptions = Array.isArray(data) 
    ? data.map((client: ClientsSchema) => ({
        value: client.CLIENTS_ID?.toString() || '',
        label: `${client.CLIENTNAME || 'Unknown'} - ${client.CLIENT_CODE || 'No Code'}`,
      }))
    : [];
  // Create the Select component once
  const selectComponent = (
    <Select
      searchable
      clearable
      limit={100}
      error={(error?.message && shouldFetch) || undefined}
      leftSection={<IconSearch />}
      rightSection={isLoading || searching ? <Loader size="xs" color="blue" /> : undefined}
      nothingFoundMessage="No clients found"
      placeholder="Search clients..."
      {...props}
      
      // Selected value - client ID when selected, otherwise null
      value={selectedClient?.CLIENTS_ID?.toString() || null}
      
      // Options for dropdown
      data={clientOptions}
      
      // Handle selection from dropdown
      onChange={(selectedValue) => {
        setSearching(true);
        if (selectedValue) {
          // Find the selected client object from data
          const client = data?.find((c: ClientsSchema) => c.CLIENTS_ID?.toString() === selectedValue);
          setSelectedClient(client || null);
          // Clear search query to stop further API requests
          setSearchQuery(null);
          setSearching(false);
        } else {
          // Clear selection when no value is selected
          setSelectedClient(null);
          setSearchQuery(null);
          setSearching(false);
        }
      }}
      
      // Handle typing in search box
      onSearchChange={(query) => {
        // Only update search if no client is selected or we're clearing the selection
        if (!selectedClient || query === "") {
          setSearchQuery(query || null);
        }
      }}
      
      // Mantine Select options
      allowDeselect
      
      // If client is selected, show its name in the input
      searchValue={selectedClient 
        ? `${selectedClient.CLIENTNAME || ''} - ${selectedClient.CLIENT_CODE || ''}` 
        : searchQuery || ""}
    />
  );

  // Conditionally wrap with tooltip based on withTooltip prop
  return withTooltip ? (
    <Tooltip label="Start typing to search for a client...">
      {selectComponent}
    </Tooltip>
  ) : (
    selectComponent
  );
};