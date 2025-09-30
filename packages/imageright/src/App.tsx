import { ImageRightFileBrowser } from "@components/file-browser/ImagerightFileBrowser";
import { useSelectedPages } from "@hooks/useSelectedPages";
import { Stack, Title } from "@mantine/core";

function App() {
  const { selectedPageIds } = useSelectedPages();
  console.log('selectedPageIds', selectedPageIds);
  return (
    <Stack m='lg'>
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <ImageRightFileBrowser />
    </Stack>
  );
}

export default App
