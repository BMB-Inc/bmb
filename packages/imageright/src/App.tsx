
import { useGetAccounts } from '@hooks/accounts';

function App() {
  // Test our actual hook from proper hooks directory
  const { data, isLoading, error } = useGetAccounts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>ImageRight</h1>
      <p>Data: {data?.name}</p>
    </div>
  );
}

export default App
