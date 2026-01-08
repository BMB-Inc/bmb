import { useEffect, useMemo, useRef, useState } from 'react';
import { Center, Loader, Stack, Text, Group, ActionIcon, NumberInput } from '@mantine/core';
import { IconZoomIn, IconZoomOut, IconZoomReset } from '@tabler/icons-react';
import * as UTIF from 'utif';

type TiffPreviewProps = {
  data: ArrayBuffer | null;
};

export default function TiffPreview({ data }: TiffPreviewProps) {
  const [scale, setScale] = useState<number>(1.0);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const tiffBytes = useMemo(() => {
    if (!data) return null;
    return new Uint8Array(data.slice(0));
  }, [data]);

  const ifds = useMemo(() => {
    if (!tiffBytes) return [];
    try {
      const decoded = UTIF.decode(tiffBytes);
      return Array.isArray(decoded) ? decoded : [];
    } catch (e) {
      console.error('Failed to decode TIFF:', e);
      return [];
    }
  }, [tiffBytes]);

  useEffect(() => {
    setError(null);
    setCurrentPage(1);
    setNumPages(ifds.length);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ifds.length]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setScale(1.0);

  const setupObserver = () => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxVisibility = 0;
        let mostVisiblePage = 1;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
            maxVisibility = entry.intersectionRatio;
            const pageNum = parseInt(entry.target.getAttribute('data-page-number') || '1', 10);
            mostVisiblePage = pageNum;
          }
        });
        if (maxVisibility > 0) setCurrentPage(mostVisiblePage);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0], rootMargin: '-10% 0px -10% 0px' }
    );
    pageRefs.current.forEach((ref) => {
      if (ref && observerRef.current) observerRef.current.observe(ref);
    });
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handlePageChange = (value: string | number) => {
    const pageNum = typeof value === 'string' ? parseInt(value, 10) : value;
    if (pageNum && pageNum >= 1 && pageNum <= numPages) {
      const el = pageRefs.current[pageNum - 1];
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // when pages render refs, set up observer
    if (numPages > 0) setupObserver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages]);

  if (!data) {
    return (
      <Center style={{ height: '100%', width: '100%' }}>
        <Text c="dimmed" size="sm">No TIFF data to display</Text>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center style={{ height: '100%', width: '100%' }}>
        <Stack align="center" gap="sm">
          <Loader size="md" />
          <Text c="dimmed" size="sm">Loading TIFF...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '100%', width: '100%' }}>
        <Text c="red" size="sm">{error}</Text>
      </Center>
    );
  }

  if (ifds.length === 0) {
    return (
      <Center style={{ height: '100%', width: '100%' }}>
        <Text c="dimmed" size="sm">No pages found in TIFF</Text>
      </Center>
    );
  }

  return (
    <Stack style={{ height: '100%', width: '100%' }} gap="xs">
      <Group justify="space-between" px="xs">
        <Group gap="xs">
          <Text size="sm">Page</Text>
          <NumberInput
            value={currentPage}
            onChange={handlePageChange}
            min={1}
            max={numPages}
            size="xs"
            w={60}
            styles={{ input: { textAlign: 'center', padding: '0 8px' } }}
          />
          <Text size="sm">of {numPages}</Text>
        </Group>
        <Group gap="xs">
          <ActionIcon onClick={handleZoomOut} disabled={scale <= 0.5} variant="subtle" size="sm">
            <IconZoomOut size={16} />
          </ActionIcon>
          <Text size="sm">{Math.round(scale * 100)}%</Text>
          <ActionIcon onClick={handleZoomIn} disabled={scale >= 3.0} variant="subtle" size="sm">
            <IconZoomIn size={16} />
          </ActionIcon>
          <ActionIcon onClick={handleZoomReset} variant="subtle" size="sm">
            <IconZoomReset size={16} />
          </ActionIcon>
        </Group>
      </Group>

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
        <Stack gap="md" style={{ width: '100%', alignItems: 'center' }}>
          {ifds.map((ifd: any, idx: number) => {
            const pageNumber = idx + 1;
            const width = ifd.width || ifd.t256;
            const height = ifd.height || ifd.t257;

            return (
              <div
                key={`tiff_${pageNumber}`}
                ref={(el) => { pageRefs.current[idx] = el; }}
                data-page-number={pageNumber}
                style={{ background: 'white', padding: 8, borderRadius: 4 }}
              >
                <TiffPageCanvas tiffBytes={tiffBytes!} ifd={ifd} scale={scale} width={width} height={height} />
              </div>
            );
          })}
        </Stack>
      </div>
    </Stack>
  );
}

function TiffPageCanvas({
  tiffBytes,
  ifd,
  scale,
  width,
  height,
}: {
  tiffBytes: Uint8Array;
  ifd: any;
  scale: number;
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!width || !height) return;

    try {
      UTIF.decodeImage(tiffBytes, ifd);
      const rgba = UTIF.toRGBA8(ifd); // Uint8Array
      const imageData = new ImageData(new Uint8ClampedArray(rgba.buffer), width, height);

      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw at 1:1 into an offscreen canvas, then scale for display
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const offCtx = off.getContext('2d');
      if (!offCtx) return;
      offCtx.putImageData(imageData, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.error('Failed to render TIFF page:', e);
    }
  }, [tiffBytes, ifd, width, height, scale]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}


