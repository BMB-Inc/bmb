import { Select } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { getClientsDto, type GetClientsDto } from "@bmb-inc/types";

type SearchKey = Exclude<keyof GetClientsDto, 'clientId'>;

interface SearchBySelectProps {
  searchKey: SearchKey;
  setSearchKey: (key: SearchKey) => void;
  setSearchQuery: (query: string) => void;
}

export const SearchBySelect = ({ searchKey, setSearchKey, setSearchQuery }: SearchBySelectProps) => {
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
        setSearchKey(nextKey);
        // Clear the current value and remove all related params immediately
        setSearchQuery('');
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          // Remove all search keys derived from the schema
          for (const key of searchKeys) params.delete(key);
          return params;
        });
      }}
    />
  );
};