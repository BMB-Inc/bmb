import { useSearchParams } from 'react-router-dom';

export function useClientUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const updateClientId = (value: string | null) => {
    setSearchParams(params => {
      if (value) {
        params.set('clientId', value);
      } else {
        params.delete('clientId');
      }
      return params;
    }, { replace: true });
  };

  return { clientId, updateClientId };
}
