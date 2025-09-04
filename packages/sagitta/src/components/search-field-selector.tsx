import { Select } from '@mantine/core';
import { useState } from 'react';
import { searchFieldOptions } from '../schemas/search-fields.schema';
import type { SearchField } from '../schemas/search-fields.schema';

interface SearchFieldSelectorProps {
  defaultField?: SearchField;
  onFieldChange?: (field: SearchField) => void;
  width?: string | number;
}

export function SearchFieldSelector({ 
  defaultField = 'staffName', 
  onFieldChange, 
  width = '120px' 
}: SearchFieldSelectorProps) {
  const [searchField, setSearchField] = useState<SearchField>(defaultField);
  
  const handleChange = (value: string | null) => {
    if (value) {
      const field = value as SearchField;
      setSearchField(field);
      if (onFieldChange) {
        onFieldChange(field);
      }
    }
  };

  return (
    <Select
      w={width}
      data={searchFieldOptions}
      value={searchField}
      onChange={handleChange}
    />
  );
}
