import { ImageRightFileBrowser } from "@components/file-browser/ImagerightFileBrowser";
import { Stack, Title } from "@mantine/core";

function App() {
  return (
    <Stack m='lg'>
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <ImageRightFileBrowser />
    </Stack>
  );
}

export default App
