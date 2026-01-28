import { Card } from '@mantine/core';
import { TreePane } from './imageright-browser/TreePane';
import { useTreeState } from '@hooks/useTreeState';
import type { ImageRightBrowserProps } from './imageright-browser/types';
import PreviewPane from '@components/file-browser/PreviewPane';
import { ImageRightProvider } from '../context/ImageRightContext';

/**
 * ImageRightBrowser
 *
 * Goals:
 * - Minimal state: navigation + activePage live in the tree browser, preview is derived.
 * - Minimal refs: preview uses AbortController + effect cleanups (no sequencing refs).
 * - Single-focus components: this is just a thin composition root.
 */
export function ImageRightBrowser({
  folderTypes,
  documentTypes,
  allowedExtensions,
  baseUrl,
  pdfDefaultZoom,
  importedDocumentIds,
}: ImageRightBrowserProps) {
  const state = useTreeState();

  return (
    <ImageRightProvider baseUrl={baseUrl}>
      <Card withBorder>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(360px, 1fr) minmax(280px, 0.6fr)',
            gap: 'var(--mantine-spacing-md)',
            alignItems: 'stretch',
            height: '63vh',
            minHeight: 0,
          }}
        >
          <div style={{ height: '100%', minHeight: 0, minWidth: 0 }}>
            <TreePane
              folderTypes={folderTypes}
              documentTypes={documentTypes}
              allowedExtensions={allowedExtensions as any}
              importedDocumentIds={importedDocumentIds}
              activePage={state.activePage}
              setActivePage={state.setActivePage}
              selectedClientId={state.nav.clientId}
              selectedDocumentId={state.nav.documentId}
              expandedRootFolders={state.nav.expandedFolders}
              toggleRootFolder={state.nav.toggleFolder}
              collapseAll={state.nav.collapseAll}
              navigateToClients={state.onBackToClients}
              navigateToClient={(id) => state.nav.navigateToClient(Number(id))}
              selectDocument={state.nav.selectDocument}
              onDocumentSelect={state.onDocumentSelect}
            />
          </div>

          <div style={{ height: '100%', minHeight: 0, minWidth: 0 }}>
            <PreviewPane
              expandedDocumentId={state.nav.documentId?.toString() ?? null}
              activePage={state.activePage}
              pdfDefaultZoom={pdfDefaultZoom}
            />
          </div>
        </div>
      </Card>
    </ImageRightProvider>
  );
}

export default ImageRightBrowser;
