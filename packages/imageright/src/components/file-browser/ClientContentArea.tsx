import { Stack } from '@mantine/core';
import DetailsTable from './DetailsTable';
import PreviewPane from './PreviewPane';
import { NameFilter } from './NameFilter';

type ClientContentAreaProps = {
  currentItems: import('./types').BrowserItem[];
  expandedDocumentId: string | null | undefined;
  /** Parent folder ID for tracking which folder the pages belong to */
  folderId?: number | null;
  navigateIntoFolder: (id: string, name?: string) => void;
  navigateToDocument: (id: string, folderId?: number | null, clientId?: number | null) => void;
  clearDocumentSelection: () => void;
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
  /** Default zoom level for PDF previews */
  pdfDefaultZoom?: number;
  /** Document IDs that have already been imported (will be displayed greyed out) */
  importedDocumentIds?: string[];
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
};

export default function ClientContentArea({
  currentItems,
  expandedDocumentId,
  folderId,
  navigateIntoFolder,
  navigateToDocument,
  allowedExtensions,
  pdfDefaultZoom,
  importedDocumentIds,
  searchQuery,
  onSearchQueryChange,
}: ClientContentAreaProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 1fr) minmax(280px, 0.6fr)',
        gap: 'var(--mantine-spacing-md)',
        alignItems: 'start',
        height: '67vh',
        minHeight: 0
      }}
    >
      <Stack style={{ minHeight: 0, height: '100%' }} gap="xs">
        {onSearchQueryChange && (
          <NameFilter
            value={searchQuery}
            onChange={onSearchQueryChange}
            delay={0}
            width={360}
            placeholder="Search documents by name"
          />
        )}
        <div style={{ overflow: 'auto', minHeight: 0, height: '100%', flex: 1 }}>
          <DetailsTable
            items={currentItems}
            onFolderOpen={(id, name) => navigateIntoFolder(id.toString(), name)}
            onDocumentOpen={(id, nextFolderId, nextClientId) => navigateToDocument(id.toString(), nextFolderId, nextClientId)}
            selectedDocumentId={expandedDocumentId ? Number(expandedDocumentId) : null}
            folderId={folderId}
            importedDocumentIds={importedDocumentIds}
          />
        </div>
      </Stack>
      <PreviewPane
        expandedDocumentId={expandedDocumentId}
        folderId={folderId}
        allowedExtensions={allowedExtensions}
        pdfDefaultZoom={pdfDefaultZoom}
      />
    </div>
  );
}


