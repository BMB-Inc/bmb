import { Select } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { getClientsDto, type GetClientsDto } from "@bmb-inc/types";

type SearchKey = Exclude<keyof GetClientsDto, 'clientId'>;

interface SearchBySelectProps {
  searchKey: SearchKey;
  setSearchKey: (key: SearchKey) => void;
}

export const SearchBySelect = ({ searchKey, setSearchKey }: SearchBySelectProps) => {
  const [, setSearchParams] = useSearchParams();

  const schemaKeys = getClientsDto.keyof().options as readonly (keyof GetClientsDto)[];
  const searchKeys: SearchKey[] = schemaKeys.filter((k): k is SearchKey => k !== 'clientId');

  const data = searchKeys.map((k) => ({
    value: k,
    label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
  }));

  return (
    <Select
      w={160}
      data={data}
      value={searchKey}
      onChange={(value) => {
        if (!value) return;
        const nextKey = value as SearchKey;
        if (!searchKeys.includes(nextKey)) return;
        // Enforce only one search key in URL: remove all known keys, then set the selected one with the current value
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          const currentValue = params.get(searchKey) ?? '';
          for (const key of searchKeys) params.delete(key);
          if (currentValue) params.set(nextKey, currentValue);
          return params;
        });
        setSearchKey(nextKey);
      }}
    />
  );
};