import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Center, Loader, Stack, Text, Group, ActionIcon, NumberInput } from '@mantine/core';
import { IconZoomIn, IconZoomOut, IconZoomReset } from '@tabler/icons-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfPreviewProps = {
  data: ArrayBuffer | null;
  /**
   * Initial zoom level for the PDF preview.
   * Clamped to [0.5, 3.0].
   */
  defaultZoom?: number;
};

function clampZoom(z: number) {
  return Math.max(0.5, Math.min(3.0, z));
}

export default function PdfPreview({ data, defaultZoom }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(() => clampZoom(typeof defaultZoom === 'number' ? defaultZoom : 1.0));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create a stable Uint8Array copy from the ArrayBuffer to prevent detachment issues
  const pdfData = useMemo(() => {
    if (!data) return null;
    // Create a copy of the ArrayBuffer to avoid detachment issues
    return new Uint8Array(data.slice(0));
  }, [data]);

  // Memoize the file object to prevent unnecessary reloads
  const fileObject = useMemo(() => {
    if (!pdfData) return null;
    return { data: pdfData };
  }, [pdfData]);

  // Reset to the configured default zoom whenever a new PDF is loaded.
  useEffect(() => {
    if (!fileObject) return;
    setScale(clampZoom(typeof defaultZoom === 'number' ? defaultZoom : 1.0));
    setCurrentPage(1);
  }, [fileObject, defaultZoom]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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

  const handlePageChange = (value: string | number) => {
    const pageNum = typeof value === 'string' ? parseInt(value) : value;
    if (pageNum && pageNum >= 1 && pageNum <= numPages) {
      // Scroll to the page
      const pageElement = pageRefs.current[pageNum - 1];
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Set up intersection observer for tracking visible pages
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the most visible page
        let maxVisibility = 0;
        let mostVisiblePage = 1;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
            maxVisibility = entry.intersectionRatio;
            const pageNum = parseInt(entry.target.getAttribute('data-page-number') || '1');
            mostVisiblePage = pageNum;
          }
        });

        if (maxVisibility > 0) {
          setCurrentPage(mostVisiblePage);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observe all page elements
    pageRefs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });
  }, []);

  const setPageRef = useCallback((pageNumber: number) => (el: HTMLDivElement | null) => {
    pageRefs.current[pageNumber - 1] = el;
    if (el && pageNumber === numPages) {
      // All pages are rendered, set up observer
      setupObserver();
    }
  }, [numPages, setupObserver]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (!fileObject) {
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
          {numPages > 0 ? (
            <>
              <Text size="sm">Page</Text>
              <NumberInput
                value={currentPage}
                onChange={handlePageChange}
                min={1}
                max={numPages}
                size="xs"
                w={60}
                styles={{
                  input: {
                    textAlign: 'center',
                    padding: '0 8px',
                  }
                }}
              />
              <Text size="sm">of {numPages}</Text>
            </>
          ) : (
            <Text size="sm">Loading...</Text>
          )}
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
          file={fileObject}
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
          <Stack gap="md">
            {Array.from(new Array(numPages), (_, index) => {
              const pageNumber = index + 1;
              return (
                <div
                  key={`page_${pageNumber}`}
                  ref={setPageRef(pageNumber)}
                  data-page-number={pageNumber}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    loading={
                      <Center style={{ height: '400px', width: '100%' }}>
                        <Loader size="sm" />
                      </Center>
                    }
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </div>
              );
            })}
          </Stack>
        </Document>
      </div>
    </Stack>
  );
}

