import { Box, Title } from "@mantine/core";
import { FileTree } from "@components/file-tree";

function App() {

  return (
    <Box p="md">
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <FileTree />
    </Box>
  );
}

export default App
