import { Stack, Title } from "@mantine/core";
import { ImageRightBrowser } from "@components/ImageRightBrowser";

function App() {
  return (
    <Stack m="lg">
      <Title order={1} ta="center" mb="xl">
        ImageRight
      </Title>
      <ImageRightBrowser pdfDefaultZoom={0.75} />
    </Stack>
  );
}

export default App
