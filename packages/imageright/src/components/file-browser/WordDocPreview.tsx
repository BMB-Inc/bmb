import { Stack, Text, ScrollArea, Paper } from '@mantine/core';
import { IconFileWord } from '@tabler/icons-react';
import { useEffect, useState, useMemo } from 'react';
import * as mammoth from 'mammoth/mammoth.browser';

type WordDocPreviewProps = {
  data: ArrayBuffer;
  extension: string;
};

export function WordDocPreview({ data, extension }: WordDocPreviewProps) {
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a stable fingerprint of the data for dependency comparison
  const dataFingerprint = useMemo(() => {
    const firstBytes = new Uint8Array(data.slice(0, 32));
    return `${data.byteLength}:${Array.from(firstBytes).join(',')}`;
  }, [data]);

  useEffect(() => {
    let cancelled = false;
    
    const convert = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await mammoth.convertToHtml({ arrayBuffer: data });
        if (!cancelled) {
          setHtml(result.value);
          
          // Log any conversion warnings (optional, for debugging)
          if (result.messages.length > 0) {
            console.debug('Mammoth conversion messages:', result.messages);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to convert Word document:', err);
          setError(err instanceof Error ? err.message : 'Failed to convert document');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    convert();
    
    return () => {
      cancelled = true;
    };
  }, [dataFingerprint, data]);

  if (loading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <IconFileWord size={32} color="var(--mantine-color-blue-5)" />
        <Text c="dimmed" size="sm">Converting document...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="red" size="sm">Error: {error}</Text>
      </Stack>
    );
  }

  if (!html) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed" size="sm">Document appears to be empty</Text>
      </Stack>
    );
  }

  return (
    <ScrollArea style={{ height: '100%' }} offsetScrollbars>
      <Paper
        p="md"
        style={{
          background: 'white',
          minHeight: '100%',
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#333',
            // Basic styling for converted content
            // mammoth produces semantic HTML: p, h1-h6, ul, ol, table, etc.
          }}
          className="word-doc-preview"
        />
        <style>{`
          .word-doc-preview p {
            margin: 0 0 1em 0;
          }
          .word-doc-preview h1, 
          .word-doc-preview h2, 
          .word-doc-preview h3, 
          .word-doc-preview h4, 
          .word-doc-preview h5, 
          .word-doc-preview h6 {
            margin: 1.5em 0 0.5em 0;
            font-weight: 600;
          }
          .word-doc-preview h1 { font-size: 1.8em; }
          .word-doc-preview h2 { font-size: 1.5em; }
          .word-doc-preview h3 { font-size: 1.25em; }
          .word-doc-preview ul, 
          .word-doc-preview ol {
            margin: 0 0 1em 0;
            padding-left: 2em;
          }
          .word-doc-preview li {
            margin-bottom: 0.25em;
          }
          .word-doc-preview table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          .word-doc-preview th,
          .word-doc-preview td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .word-doc-preview th {
            background: #f5f5f5;
            font-weight: 600;
          }
          .word-doc-preview img {
            max-width: 100%;
            height: auto;
          }
          .word-doc-preview a {
            color: var(--mantine-color-blue-6);
          }
          .word-doc-preview blockquote {
            margin: 1em 0;
            padding-left: 1em;
            border-left: 3px solid #ddd;
            color: #666;
          }
        `}</style>
      </Paper>
    </ScrollArea>
  );
}

export default WordDocPreview;

