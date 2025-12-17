import { } from '@mantine/core';
import DetailsTable from './DetailsTable';
import PreviewPane from './PreviewPane';

type ClientContentAreaProps = {
  currentItems: import('./types').BrowserItem[];
  expandedDocumentId: string | null | undefined;
  navigateIntoFolder: (id: string, name?: string) => void;
  navigateToDocument: (id: string) => void;
  clearDocumentSelection: () => void;
  /** File extensions to filter pages by (e.g., ['pdf', 'jpg']) */
  allowedExtensions?: string[];
  /** Document IDs that have already been imported (will be displayed greyed out) */
  importedDocumentIds?: string[];
};

export default function ClientContentArea({
  currentItems,
  expandedDocumentId,
  navigateIntoFolder,
  navigateToDocument,
  clearDocumentSelection,
  allowedExtensions,
  importedDocumentIds,
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
      <div style={{ overflow: 'auto', minHeight: 0, height: '100%' }}>
        <DetailsTable
          items={currentItems}
          onFolderOpen={(id, name) => navigateIntoFolder(id.toString(), name)}
          onDocumentOpen={(id) => navigateToDocument(id.toString())}
          selectedDocumentId={expandedDocumentId ? Number(expandedDocumentId) : null}
          onDocumentClear={clearDocumentSelection}
          importedDocumentIds={importedDocumentIds}
        />
      </div>
      <PreviewPane expandedDocumentId={expandedDocumentId} allowedExtensions={allowedExtensions} />
    </div>
  );
}


