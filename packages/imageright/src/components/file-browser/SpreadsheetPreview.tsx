import { Stack, Text, Table, ScrollArea, Badge, Group, Select } from '@mantine/core';
import { IconTable } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

type SheetData = {
  name: string;
  data: string[][];
};

type SpreadsheetPreviewProps = {
  data: ArrayBuffer;
  extension: string;
};

function parseSpreadsheet(buffer: ArrayBuffer): SheetData[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  return workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    // Convert to array of arrays, with header row
    const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
      header: 1,
      defval: '',
    });
    
    return {
      name: sheetName,
      data: jsonData as string[][],
    };
  });
}

export function SpreadsheetPreview({ data, extension }: SpreadsheetPreviewProps) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSheetName, setActiveSheetName] = useState<string | null>(null);

  useEffect(() => {
    const parse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const parsed = parseSpreadsheet(data);
        setSheets(parsed);
        // Set the first sheet as active by default
        if (parsed.length > 0) {
          setActiveSheetName(parsed[0].name);
        }
      } catch (err) {
        console.error('Failed to parse spreadsheet:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse spreadsheet');
      } finally {
        setLoading(false);
      }
    };

    parse();
  }, [data, extension]);

  if (loading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed" size="sm">Parsing spreadsheet...</Text>
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

  if (sheets.length === 0) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed" size="sm">No data in spreadsheet</Text>
      </Stack>
    );
  }

  const activeSheet = sheets.find((s) => s.name === activeSheetName) || sheets[0];
  const maxPreviewRows = 500; // Limit rows for performance
  const maxPreviewCols = 50; // Limit columns for performance
  const displayData = activeSheet.data.slice(0, maxPreviewRows);
  const maxCols = Math.min(
    Math.max(...displayData.map((row) => row.length), 0),
    maxPreviewCols
  );

  // Build select options with row counts
  const sheetOptions = sheets.map((sheet) => ({
    value: sheet.name,
    label: `${sheet.name} (${sheet.data.length} rows)`,
  }));

  return (
    <Stack gap={0} h="100%" style={{ overflow: 'hidden' }}>
      {/* Sheet selector header */}
      <Group
        gap="xs"
        p="xs"
        style={{ 
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          background: 'var(--mantine-color-gray-0)',
          flexShrink: 0,
        }}
      >
        <IconTable size={16} color="var(--mantine-color-gray-6)" />
        {sheets.length > 1 ? (
          <Select
            size="xs"
            value={activeSheetName}
            onChange={setActiveSheetName}
            data={sheetOptions}
            style={{ minWidth: 200, maxWidth: 300 }}
            comboboxProps={{ withinPortal: false }}
          />
        ) : (
          <Text size="sm" fw={500}>{activeSheet.name}</Text>
        )}
        <Badge size="xs" variant="light" color="gray">
          {activeSheet.data.length} rows × {maxCols} cols
        </Badge>
        {sheets.length > 1 && (
          <Badge size="xs" variant="light" color="blue">
            {sheets.length} sheets
          </Badge>
        )}
      </Group>

      {/* Truncation warning */}
      {(activeSheet.data.length > maxPreviewRows || maxCols < Math.max(...activeSheet.data.map((r) => r.length), 0)) && (
        <Text size="xs" c="orange" px="xs" py={4} style={{ background: 'var(--mantine-color-orange-0)', flexShrink: 0 }}>
          Preview limited to first {maxPreviewRows} rows and {maxPreviewCols} columns.
        </Text>
      )}

      {/* Table data */}
      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          style={{ 
            fontSize: 'var(--mantine-font-size-xs)',
            tableLayout: 'auto',
          }}
        >
          {displayData.length > 0 && (
            <>
              <Table.Thead style={{ position: 'sticky', top: 0, background: 'var(--mantine-color-gray-1)', zIndex: 1 }}>
                <Table.Tr>
                  {/* Row number column */}
                  <Table.Th style={{ 
                    width: 40, 
                    textAlign: 'center',
                    background: 'var(--mantine-color-gray-2)',
                    fontWeight: 600,
                  }}>
                    #
                  </Table.Th>
                  {/* First row as header */}
                  {displayData[0]?.slice(0, maxCols).map((cell, colIdx) => (
                    <Table.Th
                      key={colIdx}
                      style={{
                        whiteSpace: 'nowrap',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 600,
                      }}
                      title={String(cell ?? '')}
                    >
                      {String(cell ?? '')}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {displayData.slice(1).map((row, rowIdx) => (
                  <Table.Tr key={rowIdx}>
                    {/* Row number */}
                    <Table.Td style={{ 
                      textAlign: 'center', 
                      color: 'var(--mantine-color-gray-5)',
                      background: 'var(--mantine-color-gray-0)',
                      fontWeight: 500,
                    }}>
                      {rowIdx + 2}
                    </Table.Td>
                    {/* Data cells */}
                    {Array.from({ length: maxCols }).map((_, colIdx) => (
                      <Table.Td
                        key={colIdx}
                        style={{
                          whiteSpace: 'nowrap',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={String(row[colIdx] ?? '')}
                      >
                        {String(row[colIdx] ?? '')}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </>
          )}
        </Table>
      </ScrollArea>
    </Stack>
  );
}

export default SpreadsheetPreview;
