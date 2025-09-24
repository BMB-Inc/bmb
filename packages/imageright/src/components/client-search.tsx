import { Loader, TextInput } from "@mantine/core";
import { IconSearch } from '@tabler/icons-react';

interface ClientSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const ClientSearch = ({ searchQuery, onSearchChange, isLoading, error }: ClientSearchProps) => {
  return (
    <TextInput 
      placeholder="Search clients..." 
      error={error} 
      leftSection={<IconSearch />} 
      rightSection={isLoading ? <Loader size="xs" color="blue" /> : undefined} 
      value={searchQuery} 
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};
