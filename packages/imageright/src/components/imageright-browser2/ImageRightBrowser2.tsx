import { ImageRightProvider } from '../../context/ImageRightContext';
import BrowserShell from './BrowserShell';
import PreviewPaneV2 from './PreviewPaneV2';
import { TreePane } from './TreePane';
import { useTreeState } from './useTreeState';
import type { ImageRightBrowser2Props } from './types';

/**
 * ImageRightBrowser 2.0
 *
 * Goals:
 * - Minimal state: navigation + activePage live in the tree browser, preview is derived.
 * - Minimal refs: preview uses AbortController + effect cleanups (no sequencing refs).
 * - Single-focus components: this is just a thin composition root.
 */
export function ImageRightBrowser2({
  folderTypes,
  documentTypes,
  allowedExtensions,
  baseUrl,
  pdfDefaultZoom,
  importedDocumentIds,
}: ImageRightBrowser2Props) {
  const state = useTreeState();

  return (
    <ImageRightProvider baseUrl={baseUrl}>
      <BrowserShell>
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
              navigateToClient={state.nav.navigateToClient}
              selectDocument={state.nav.selectDocument}
              onDocumentSelect={state.onDocumentSelect}
            />
          </div>

          <div style={{ height: '100%', minHeight: 0, minWidth: 0 }}>
            <PreviewPaneV2
              expandedDocumentId={state.nav.documentId?.toString() ?? null}
              activePage={state.activePage}
              pdfDefaultZoom={pdfDefaultZoom}
            />
          </div>
        </div>
      </BrowserShell>
    </ImageRightProvider>
  );
}

export default ImageRightBrowser2;


