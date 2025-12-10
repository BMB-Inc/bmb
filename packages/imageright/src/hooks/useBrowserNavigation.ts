import { useQueryStates, parseAsString } from 'nuqs';

export function useBrowserNavigation() {
  const [{ clientId, folderId, folderName, documentId, pageId }, setQs] = useQueryStates({
    clientId: parseAsString,
    folderId: parseAsString,
    folderName: parseAsString,
    documentId: parseAsString,
    pageId: parseAsString,
  });

  const navigateToClients = () =>
    setQs({ clientId: null, folderId: null, folderName: null, documentId: null, pageId: null }, { history: 'push' });

  const navigateToClient = (id: string) =>
    setQs({ clientId: id, folderId: null, folderName: null, documentId: null, pageId: null }, { history: 'push' });

  const navigateToClientRoot = () =>
    clientId && setQs({ clientId, folderId: null, folderName: null, documentId: null, pageId: null }, { history: 'push' });

  const navigateIntoFolder = (id: string, name?: string) =>
    setQs({ clientId: clientId ?? null, folderId: id, folderName: name ?? null, documentId: null, pageId: null }, { history: 'push' });

  const navigateToDocument = (id: string) =>
    setQs({ clientId: clientId ?? null, folderId: folderId ?? null, folderName: folderName ?? null, documentId: id, pageId: null }, { history: 'push' });

  const navigateToPage = (id: string) =>
    setQs({ clientId: clientId ?? null, folderId: folderId ?? null, folderName: folderName ?? null, documentId: documentId ?? null, pageId: id }, { history: 'push' });

  const clearDocumentSelection = () =>
    setQs({ clientId: clientId ?? null, folderId: folderId ?? null, folderName: folderName ?? null, documentId: null, pageId: null }, { history: 'push' });

  return {
    clientId,
    folderId,
    folderName,
    documentId,
    pageId,
    currentFolderId: folderId,
    navigateToClients,
    navigateToClient,
    navigateToClientRoot,
    navigateIntoFolder,
    navigateToDocument,
    navigateToPage,
    clearDocumentSelection,
  } as const;
}