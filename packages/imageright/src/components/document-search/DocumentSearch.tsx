import { TextInput, ActionIcon, Group } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';

type DocumentSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function DocumentSearch({ 
  value, 
  onChange,
  placeholder = 'Search documents by name...',
}: DocumentSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue] = useDebouncedValue(inputValue, 300);

  // Sync debounced value to parent
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <TextInput
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
      rightSection={
        inputValue ? (
          <ActionIcon 
            size="sm" 
            variant="subtle" 
            onClick={() => {
              setInputValue('');
              onChange('');
            }}
          >
            <IconX size={14} />
          </ActionIcon>
        ) : null
      }
      size="sm"
      styles={{
        input: {
          minWidth: 200,
        },
      }}
    />
  );
}

export default DocumentSearch;























