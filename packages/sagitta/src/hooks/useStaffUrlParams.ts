import { useQueryState, parseAsString } from 'nuqs';

export function useStaffUrlParams() {
  const [staffCode, setStaffCode] = useQueryState('staffCode', parseAsString);
  const updateStaffCode = (value: string | null) => setStaffCode(value, { history: 'replace' });
  return { staffCode, updateStaffCode };
}
