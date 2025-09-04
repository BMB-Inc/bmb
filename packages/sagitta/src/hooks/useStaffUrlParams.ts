import { useSearchParams } from 'react-router-dom';

export function useStaffUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const staffCode = searchParams.get('staffCode');
  
  const updateStaffCode = (value: string | null) => {
    setSearchParams(params => {
      if (value) {
        params.set('staffCode', value);
      } else {
        params.delete('staffCode');
      }
      return params;
    }, { replace: true });
  };

  return { staffCode, updateStaffCode };
}
