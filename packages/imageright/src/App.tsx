import { ImageRightFileBrowser } from "@components/file-browser/ImagerightFileBrowser";
import { useSelectedDocuments } from "@hooks/useSelectedDocuments";
import { useSelectedPages } from "@hooks/useSelectedPages";
import { Stack, Title } from "@mantine/core";

function App() {
  const { selectedPageIds } = useSelectedPages();
  const { selectedDocumentIds } = useSelectedDocuments();
  console.log('selectedPageIds', selectedPageIds);
  console.log('selectedDocumentIds', selectedDocumentIds);
  return (
    <Stack m='lg'>
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <ImageRightFileBrowser />
    </Stack>
  );
}

export default App
