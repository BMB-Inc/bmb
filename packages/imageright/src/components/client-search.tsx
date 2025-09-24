import { ActionIcon, Group, Loader, Select, TextInput } from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useUrlParams } from "@hooks/useUrlParams";
import { imagerightClientSearchSchema } from "@bmb-inc/types";
interface ClientSearchProps {
  isLoading?: boolean;
  error?: string;
}

export const ClientSearch = ({ isLoading, error }: ClientSearchProps) => {
  const { setParam, clearAllParams, getParam } = useUrlParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('clientCode');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  
  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setParam(searchBy, debouncedSearchQuery);
    } else {
      // Clear all search params when query is empty
      const searchOptions = Object.keys(imagerightClientSearchSchema.shape);
      searchOptions.forEach(param => {
        if (getParam(param)) {
          clearAllParams();
        }
      });
    }
  }, [debouncedSearchQuery, searchBy, setParam, clearAllParams, getParam]);
  
  const handleSearchByChange = (newSearchBy: string | null) => {
    if (newSearchBy) {
      clearAllParams();
      setSearchQuery('');
      setSearchBy(newSearchBy);
    }
  };

  const searchByOptions = Object.keys(imagerightClientSearchSchema.shape);
  const normalizedSearchByOptions = searchByOptions.map((option) => ({
    value: option,
    label: option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
  }));

  return (
    <Group>
      <Select
        placeholder="Search By"
        data={normalizedSearchByOptions}
        onChange={handleSearchByChange}
        value={searchBy}
      />
      <TextInput
        flex={1}
        placeholder="Search clients..." 
        error={error} 
        leftSection={<IconSearch />} 
        rightSection={isLoading ? <Loader size="xs" color="blue" /> : searchQuery ? <ActionIcon size="xs" color="dimmed" variant="subtle" onClick={() => setSearchQuery('')}><IconX /></ActionIcon> : undefined} 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Group>
  );
};
