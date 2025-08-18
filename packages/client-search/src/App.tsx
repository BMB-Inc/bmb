import './App.css'
import { Card, Divider, Title } from '@mantine/core';
import { ClientSearch } from './components/client-search';
import { FormExample } from './components/form-example';

function App() {
  return (
    <>
      <Title order={1} mb="md">Client Search Examples</Title>
      
      <Card withBorder mb="xl">
        <Title order={2} mb="md">Standalone Component</Title>
        <ClientSearch />
      </Card>
      
      <Divider my="xl" />
      
      <FormExample />
    </>
  )
}

export default App
