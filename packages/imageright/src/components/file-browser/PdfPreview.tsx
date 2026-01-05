import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Center, Loader, Stack, Text, Button, Group, ActionIcon } from '@mantine/core';
import { IconZoomIn, IconZoomOut, IconZoomReset, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfPreviewProps = {
  data: ArrayBuffer | null;
};

export default function PdfPreview({ data }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (data) {
      setPdfData(new Uint8Array(data));
    } else {
      setPdfData(null);
    }
  }, [data]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1.0);
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  if (!pdfData) {
    return (
      <Center style={{ height: '100%', width: '100%' }}>
        <Text c="dimmed" size="sm">
          No PDF data to display
        </Text>
      </Center>
    );
  }

  return (
    <Stack style={{ height: '100%', width: '100%' }} gap="xs">
      {/* Controls */}
      <Group justify="space-between" px="xs">
        <Group gap="xs">
          <ActionIcon
            onClick={handlePrevPage}
            disabled={pageNumber <= 1}
            variant="subtle"
            size="sm"
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          <Text size="sm">
            Page {pageNumber} of {numPages}
          </Text>
          <ActionIcon
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            variant="subtle"
            size="sm"
          >
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
        <Group gap="xs">
          <ActionIcon
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            variant="subtle"
            size="sm"
          >
            <IconZoomOut size={16} />
          </ActionIcon>
          <Text size="sm">{Math.round(scale * 100)}%</Text>
          <ActionIcon
            onClick={handleZoomIn}
            disabled={scale >= 3.0}
            variant="subtle"
            size="sm"
          >
            <IconZoomIn size={16} />
          </ActionIcon>
          <ActionIcon
            onClick={handleZoomReset}
            variant="subtle"
            size="sm"
          >
            <IconZoomReset size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* PDF Viewer */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#525659',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '16px',
        }}
      >
        <Document
          file={{ data: pdfData }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <Center style={{ height: '400px' }}>
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text c="dimmed" size="sm">
                  Loading PDF...
                </Text>
              </Stack>
            </Center>
          }
          error={
            <Center style={{ height: '400px' }}>
              <Text c="red" size="sm">
                Failed to load PDF
              </Text>
            </Center>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={
              <Center style={{ height: '400px' }}>
                <Loader size="sm" />
              </Center>
            }
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </Stack>
  );
}

