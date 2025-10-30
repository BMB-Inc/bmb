import { useEffect, useState } from 'react';
import { ActionIcon, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

type NameFilterProps = {
  value?: string;
  onChange: (query: string) => void;
  delay?: number;
  width?: number;
  placeholder?: string;
};

export function NameFilter({ value = '', onChange, delay = 500, width = 300, placeholder = 'Search name' }: NameFilterProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(() => {
      onChange(inputValue);
    }, delay);
    return () => clearTimeout(handle);
  }, [inputValue, delay, onChange]);

  return (
    <TextInput
      placeholder={placeholder}
      size="xs"
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget.value)}
      rightSectionPointerEvents="all"
      rightSection={inputValue ? (
        <ActionIcon
          size="xs"
          color="dimmed"
          variant="transparent"
          onClick={() => {
            setInputValue('');
            onChange('');
          }}
        >
          <IconX />
        </ActionIcon>
      ) : undefined}
      style={{ width }}
    />
  );
}

export default NameFilter;


