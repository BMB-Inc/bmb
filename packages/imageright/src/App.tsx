import { ImageRightFileBrowser } from "@components/file-browser/ImagerightFileBrowser";
import { Button, Group, Modal, Stack, Title } from "@mantine/core";
import { DocumentTypes, FolderTypes } from "@bmb-inc/types";
import { useDisclosure } from "@mantine/hooks";

function App() {
  const [opened, {open, close}] = useDisclosure(false);
  return (
    <Stack m='lg'>
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <Button onClick={open}>Open Modal</Button>
      <Modal opened={opened} onClose={close} title="ImageRight" size="70%">
      <Stack>
        <ImageRightFileBrowser folderTypes={[FolderTypes.applications, FolderTypes.policies, FolderTypes.submissions, FolderTypes.blueFolder]} />

        <Group justify="space-between" align="center">
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="filled"
            >
              Use selected
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
    </Stack>
  );
}

export default App
