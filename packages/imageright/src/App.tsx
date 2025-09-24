import { Button } from "@mantine/core";
import { useClients } from "@hooks/index";

function App() {
  const { data, isLoading, error } = useClients('123', 'John Doe');

  return (
    <div>
      <h1>ImageRight</h1>
      <Button onClick={() => {}}>Get Clients</Button>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}

export default App
