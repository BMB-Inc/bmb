import { ImageRightFileBrowser } from "@components/imageright-file-browser";
import { Box, Title } from "@mantine/core";

function App() {
  return (
    <Box p="md">
      <Title order={1} ta="center" mb="xl">ImageRight</Title>
      <ImageRightFileBrowser />
    </Box>
  );
}

export default App
