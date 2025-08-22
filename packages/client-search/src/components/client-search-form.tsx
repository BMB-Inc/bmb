import { type UseFormReturnType } from "@mantine/form";
import type { ClientsSchema } from "@bmb-inc/types";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetClients } from "../hooks/useGetClients";
import { useGetClientById } from "../hooks/useGetClientById";
import { Select, SelectProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Loader } from "@mantine/core";

// Define a generic interface for the form values
export interface FormValues {
  [key: string]: string | null | undefined;
}

// Define the props for the ClientSearchForm component
export interface ClientSearchFormProps<T extends Record<string, any>> extends Omit<SelectProps, 'data' | 'onChange' | 'value' | 'form'> {
  form: UseFormReturnType<T>;
  name: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  mt?: string | number;
}

export const ClientSearchForm = <T extends Record<string, any>>({ 
  form, 
  name, 
  label, 
  placeholder = 'Search clients...', 
  disabled = false,
  ...props
}: ClientSearchFormProps<T>) => {
  // State for search and selection
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  const [selectedClient, setSelectedClient] = useState<ClientsSchema | null>(null);
  const [searching, setSearching] = useState<boolean>(false);
  
  // Get value from form
  const formValue = form.values[name];
  
  // Fetch client by ID if form has a value but no selected client
  const { data: clientById } = useGetClientById(
    formValue && !selectedClient ? formValue as string : null
  );
  
  // When client is fetched by ID, set it as the selected client
  useEffect(() => {
    if (clientById && Array.isArray(clientById) && clientById.length > 0 && formValue && !selectedClient) {
      // API returns an array, so we need to use the first item
      setSelectedClient(clientById[0]);
    }
  }, [clientById, formValue, selectedClient]);
  
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
    
  // Show error if present but only if we're actually searching
  const errorMessage = (error instanceof Error && shouldFetch) ? error.message : undefined;

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
      {...props}
      
      // Get all form input props for validation, errors, etc.
      {...form.getInputProps(name)}
      
      // Only display form errors when field is touched and has a value, or API errors during search
      error={(form.getInputProps(name).error && form.isTouched(name) && formValue) || errorMessage}
      
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
          
          // Update the form with proper typing
          form.setValues(values => ({
            ...values,
            [name]: selectedValue
          }));
          
          // Clear search query to stop further API requests
          setSearchQuery(null);
        } else {
          // Clear selection when no value is selected
          setSelectedClient(null);
          setSearchQuery(null);
          
          // Clear the form field with proper typing
          form.setValues(values => ({
            ...values,
            [name]: null
          }));
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