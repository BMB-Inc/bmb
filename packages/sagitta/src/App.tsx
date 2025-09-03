import { useState } from 'react'
import { Container, Title, Space, Paper, Button, Group } from '@mantine/core'
import { ClientSearch } from './components/client-search'
import { StaffSearch } from './components/staff-search'
import { FormExample } from './components/form-example'

function App() {
  const [activeView, setActiveView] = useState<'client' | 'staff' | 'form'>('client')

  return (
    <Container size="xl" py="xl">
      <Title order={1} ta="center" mb="xl">
        Sagitta Components Testing
      </Title>
      
      <Group justify="center" mb="md">
        <Button 
          variant={activeView === 'client' ? 'filled' : 'outline'}
          onClick={() => setActiveView('client')}
        >
          Client Search
        </Button>
        <Button 
          variant={activeView === 'staff' ? 'filled' : 'outline'}
          onClick={() => setActiveView('staff')}
        >
          Staff Search
        </Button>
        <Button 
          variant={activeView === 'form' ? 'filled' : 'outline'}
          onClick={() => setActiveView('form')}
        >
          Form Example
        </Button>
      </Group>

      <Space h="md" />

      {activeView === 'client' && (
        <Paper p="md" withBorder>
          <Title order={2} mb="md">Client Search Component</Title>
          <ClientSearch />
        </Paper>
      )}

      {activeView === 'staff' && (
        <Paper p="md" withBorder>
          <Title order={2} mb="md">Staff Search Component</Title>
          <StaffSearch />
        </Paper>
      )}

      {activeView === 'form' && (
        <Paper p="md" withBorder>
          <Title order={2} mb="md">Form Example</Title>
          <FormExample />
        </Paper>
      ) }
    </Container>
  )
}

export default App
