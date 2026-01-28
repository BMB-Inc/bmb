import { useEffect, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import { parseAsString, useQueryState } from 'nuqs';

type UseDocumentSearchParamResult = {
  value: string;
  onChange: (nextValue: string) => void;
  searchParam: string | null;
  clear: () => void;
};

export function useDocumentSearchParam(debounceMs = 500): UseDocumentSearchParamResult {
  const [searchParam, setSearchParam] = useQueryState('documentSearch', parseAsString);
  const [value, setValue] = useState(searchParam ?? '');
  const updateParam = useDebouncedCallback((nextValue: string) => {
    const trimmed = nextValue.trim();
    setSearchParam(trimmed ? trimmed : null);
  }, debounceMs);

  useEffect(() => {
    setValue(searchParam ?? '');
  }, [searchParam]);

  const onChange = (nextValue: string) => {
    setValue(nextValue);
    if (!nextValue.trim()) {
      updateParam.cancel();
      setSearchParam(null);
      return;
    }
    updateParam(nextValue);
  };

  const clear = () => {
    setValue('');
    updateParam.cancel();
    setSearchParam(null);
  };

  return { value, onChange, searchParam, clear };
}
