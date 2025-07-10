import React, { memo } from 'react';
import { ActionIcon, Tooltip } from "@mantine/core";
import ExcelJS from "exceljs";
import { IconDownload } from "@tabler/icons-react";

// Helper to format headers to normal case
function formatHeader(key: string) {
  // If the key is all uppercase (no lowercase letters), just capitalize the first letter of each word
  if (/^[A-Z0-9_]+$/.test(key)) {
    return key
      .replace(/_/g, ' ') // Replace underscores with spaces
      .toLowerCase()
      .replace(/(^|\s)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  }
  // Otherwise, insert spaces before capitals and capitalize each word
  const withSpaces = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
  return withSpaces
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const DownloadXLSX = memo(({ data, title }: { data: any[]; title: string }) => {
  async function downloadXLSX() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Get all keys except APPLICATION_ID and format them
    const keys = Object.keys(data[0])
      .filter(key => key !== 'APPLICATION_ID')
      .map(key => ({
        header: formatHeader(key),
        key,
        width: 20 // Set default column width
      }));

    worksheet.columns = keys;

    // Add header style
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows with formatting
    data.forEach((item, index) => {
      const row = worksheet.addRow({ ...item, index: index + 1 });
      
      // Format numeric columns
      keys.forEach(({ key }) => {
        const cell = row.getCell(key);
        if (typeof item[key] === 'number') {
          cell.numFmt = '#,##0.00';
        }
      });
    });

    // Add borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${title} - ${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Tooltip label="Download as Excel">
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        onClick={downloadXLSX}
      >
        <IconDownload />
      </ActionIcon>
    </Tooltip>
  );
});
