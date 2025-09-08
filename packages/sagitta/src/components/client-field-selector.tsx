import { Select } from '@mantine/core';
import { useState } from 'react';
import { clientFieldOptions } from '@schemas/client-fields.schema';
import type { ClientField } from '@schemas/client-fields.schema';

interface ClientFieldSelectorProps {
  defaultField?: ClientField;
  onFieldChange?: (field: ClientField) => void;
  width?: string | number;
}

export function ClientFieldSelector({ 
  defaultField = 'clientName', 
  onFieldChange, 
  width = '120px' 
}: ClientFieldSelectorProps) {
  const [clientField, setClientField] = useState<ClientField>(defaultField);
  
  const handleChange = (value: string | null) => {
    if (value) {
      const field = value as ClientField;
      setClientField(field);
      if (onFieldChange) {
        onFieldChange(field);
      }
    }
  };

  return (
    <Select
      w={width}
      data={clientFieldOptions}
      value={clientField}
      onChange={handleChange}
    />
  );
}
