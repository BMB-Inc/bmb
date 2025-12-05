import { ImageRightFileBrowser } from "@components/file-browser/ImagerightFileBrowser";
import { Button, Modal, Stack, Title } from "@mantine/core";
import { DocumentTypes, FolderTypes } from "@bmb-inc/types";
import { useDisclosure } from "@mantine/hooks";

function App() {
  const [opened, {open, close}] = useDisclosure(false);
  return (
    <Stack m='lg'>
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <Button onClick={open}>Open Modal</Button>
      <Modal opened={opened} onClose={close} title="ImageRight" size="80%">
      <ImageRightFileBrowser folderTypes={[FolderTypes.policies, FolderTypes.submissions, FolderTypes.applications]} documentTypes={[DocumentTypes.applications]} />
      </Modal>
    </Stack>
  );
}

export default App
