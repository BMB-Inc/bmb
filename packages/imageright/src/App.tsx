import { ImageRightFileBrowser } from "@components/file-browser/ImagerightFileBrowser";
import { useSelectedDocuments } from "@hooks/useSelectedDocuments";
import { useSelectedPages } from "@hooks/useSelectedPages";
import { Button, Modal, Stack, Title } from "@mantine/core";
import { DocumentTypes, FolderTypes } from "@bmb-inc/types";
import { useDisclosure } from "@mantine/hooks";

function App() {
  const { selectedPageIds } = useSelectedPages();
  const { selectedDocumentIds } = useSelectedDocuments();
  console.log('selectedPageIds', selectedPageIds);
  console.log('selectedDocumentIds', selectedDocumentIds);
  const [opened, {open, close}] = useDisclosure(false);
  return (
    <Stack m='lg'>
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <Button onClick={open}>Open Modal</Button>
      <Modal opened={opened} onClose={close} title="ImageRight" size="80%">
      <ImageRightFileBrowser folderTypes={[FolderTypes.submissions, FolderTypes.applications]} documentType={DocumentTypes.applications} />
      </Modal>
    </Stack>
  );
}

export default App
