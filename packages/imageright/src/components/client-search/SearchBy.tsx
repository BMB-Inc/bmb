import { Select } from "@mantine/core";
import { getClientsDto, type GetClientsDto } from "@bmb-inc/types";

type SearchKey = Exclude<keyof GetClientsDto, 'clientId'>;

interface SearchBySelectProps {
  searchKey: SearchKey;
  setSearchKey: (key: SearchKey) => void;
}

export const SearchBy = ({ searchKey, setSearchKey }: SearchBySelectProps) => {
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
      }}
    />
  );
};