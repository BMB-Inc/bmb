import { useQueryState, parseAsString } from 'nuqs';

export function useClientUrlParams() {
  const [clientId, setClientId] = useQueryState('clientId', parseAsString);
  const updateClientId = (value: string | null) => setClientId(value, { history: 'replace' });
  return { clientId, updateClientId };
}
