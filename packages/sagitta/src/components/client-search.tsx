import type { ClientsSchema } from "@bmb-inc/types";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetClients } from "../hooks/useGetClients";
import { useClientUrlParams } from "../hooks/useClientUrlParams";
import { Select, SelectProps, Tooltip, Group } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Loader } from "@mantine/core";
import { ClientFieldSelector } from "./client-field-selector";
import type { ClientField } from "@schemas/client-fields.schema";

interface ClientSearchProps extends Omit<SelectProps, 'data' | 'onChange' | 'value'> {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  withTooltip?: boolean;
  baseUrl?: string;
  withFieldSelector?: boolean;
  defaultField?: ClientField;
  onFieldChange?: (field: ClientField) => void;
}

export const ClientSearch = ({
  withTooltip = false, 
  baseUrl, 
  withFieldSelector = true,
  defaultField = 'clientName',
  onFieldChange,
  ...props
}: ClientSearchProps) => {
  // State for search and selection
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const [selectedClient, setSelectedClient] = useState<ClientsSchema | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchField, setSearchField] = useState<ClientField>(defaultField);
  
  // URL params management
  const { updateClientId } = useClientUrlParams();
  
  // Only fetch when actively searching and no client is selected
  const shouldFetch = !selectedClient && debouncedSearchQuery && debouncedSearchQuery.length > 0;
  const { data, isLoading, error } = useGetClients(
    shouldFetch ? debouncedSearchQuery : "", 
    searchField,
    baseUrl
  );

  // Convert client data to select options format
  const clientOptions = Array.isArray(data) 
    ? data.map((client: ClientsSchema) => ({
        value: client.CLIENTS_ID?.toString() || '',
        label: `${client.CLIENTNAME || 'Unknown'} - ${client.CLIENT_CODE || 'No Code'}`,
      }))
    : [];

  // Handle field change
  const handleFieldChange = (field: ClientField) => {
    setSearchField(field);
    // Clear current search and selection when field changes
    setSelectedClient(null);
    setSearchQuery(null);
    if (onFieldChange) {
      onFieldChange(field);
    }
  };

  // Create the Select component once
  const selectComponent = withFieldSelector ? (
    <div>
      {props.label && <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>{props.label}</div>}
      <Group gap="xs" align="flex-end">
        <ClientFieldSelector
          defaultField={searchField}
          onFieldChange={handleFieldChange}
          width="160px"
        />
        <Select
          searchable
          clearable
          limit={100}
          error={(error?.message && shouldFetch) || undefined}
          leftSection={<IconSearch />}
          rightSection={isLoading || searching ? <Loader size="xs" color="blue" /> : undefined}
          nothingFoundMessage="No clients found"
          placeholder="Search clients..."
          style={{ flex: 1 }}
          {...props}
          label={undefined} // Remove label since we handle it above
          
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
              // Update URL parameter
              updateClientId(selectedValue);
              // Clear search query to stop further API requests
              setSearchQuery(null);
              setSearching(false);
            } else {
              // Clear selection when no value is selected
              setSelectedClient(null);
              setSearchQuery(null);
              // Clear URL parameter
              updateClientId(null);
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
      </Group>
    </div>
  ) : (
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
          // Update URL parameter
          updateClientId(selectedValue);
          // Clear search query to stop further API requests
          setSearchQuery(null);
          setSearching(false);
        } else {
          // Clear selection when no value is selected
          setSelectedClient(null);
          setSearchQuery(null);
          // Clear URL parameter
          updateClientId(null);
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
