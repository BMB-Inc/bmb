import { Loader, Text, Stack, Center } from '@mantine/core';

export function AuthCheckingScreen() {
  return (
    <Center style={{ height: '100vh', width: '100vw', backgroundColor: 'white' }}>
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text size="lg" fw={500} c="dimmed">
          Checking authentication...
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          Please wait while we verify your credentials
        </Text>
      </Stack>
    </Center>
  );
} 