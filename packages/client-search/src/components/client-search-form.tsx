import { type UseFormReturnType } from "@mantine/form";
import type { ClientsSchema } from "@bmb-inc/types";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetClients } from "../hooks/useGetClients";
import { Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Loader } from "@mantine/core";

/**
 * A more sophisticated type-safe implementation of ClientSearchForm.
 * T is the form values type
 * K is the name of the field in the form that will store the client ID
 */
interface ClientSearchFormProps<T, K extends keyof T> {
  form: UseFormReturnType<T>;
  name: K;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  mt?: string | number;
}

export const ClientSearchForm = <T, K extends keyof T>({ 
  form, 
  name, 
  label = 'Client', 
  placeholder = 'Search clients...', 
  disabled = false,
  ...props
}: ClientSearchFormProps<T, K>) => {
  // State for search and selection
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const [selectedClient, setSelectedClient] = useState<ClientsSchema | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  
  // Get value from form
  const formValue = form.values[name];
  
  // Only fetch when actively searching and no client is selected
  const shouldFetch = !selectedClient && debouncedSearchQuery && debouncedSearchQuery.length > 0;
  const { data, isLoading, error } = useGetClients(shouldFetch ? debouncedSearchQuery : "");

  // Convert client data to select options format and handle errors
  const clientOptions = Array.isArray(data) 
    ? data.map((client: ClientsSchema) => ({
        value: client.CLIENTS_ID?.toString() || '',
        label: `${client.CLIENTNAME || 'Unknown'} - ${client.CLIENT_CODE || 'No Code'}`,
      }))
    : [];
    
  // Show error if present
  const errorMessage = error instanceof Error ? error.message : undefined;

  return (
    <Select
      searchable
      clearable
      limit={100}
      leftSection={<IconSearch />}
      rightSection={isLoading || searching ? <Loader size="xs" color="blue" /> : undefined}
      nothingFoundMessage="No clients found"
      placeholder={placeholder}
      label={label}
      disabled={disabled}
      
      // Get all form input props for validation, errors, etc.
      {...form.getInputProps(name)}
      
      // Display API errors if present
      error={form.getInputProps(name).error || errorMessage}
      
      // Options dropdown data
      data={clientOptions}
      
      // Override value and onChange to work with our component
      value={formValue || selectedClient?.CLIENTS_ID?.toString() || null}
      onChange={(selectedValue) => {
        setSearching(true);
        
        if (selectedValue) {
          // Find the selected client object from data
          const client = data?.find((c: ClientsSchema) => c.CLIENTS_ID?.toString() === selectedValue);
          setSelectedClient(client || null);
          
          // Update the form with proper typing - no 'as any' needed
          form.setFieldValue(name, selectedValue);
          
          // Clear search query to stop further API requests
          setSearchQuery(null);
        } else {
          // Clear selection when no value is selected
          setSelectedClient(null);
          setSearchQuery(null);
          
          // Clear the form field with proper typing - no 'as any' needed
          form.setFieldValue(name, null);
        }
        
        setSearching(false);
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
        
      // Pass through any additional props
      {...props}
    />
  );
};