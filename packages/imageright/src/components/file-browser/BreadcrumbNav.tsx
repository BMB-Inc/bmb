import { Breadcrumbs, Anchor } from '@mantine/core';

type BreadcrumbNavProps = {
  expandedClientId: string | null;
  clientLabel?: string | null;
  folderId?: string | null;
  folderLabel?: string | null;
  onClientsClick: () => void;
  onClientRootClick: () => void;
};

export function BreadcrumbNav({ expandedClientId, clientLabel, folderId, folderLabel, onClientsClick, onClientRootClick }: BreadcrumbNavProps) {
  return (
    <Breadcrumbs>
      <Anchor onClick={onClientsClick}>Clients</Anchor>
      {expandedClientId && (
        <Anchor onClick={onClientRootClick}>
          {clientLabel || `Client ${expandedClientId}`}
        </Anchor>
      )}
      {folderId && (
        <Anchor>
          {folderLabel || `Folder ${folderId}`}
        </Anchor>
      )}
    </Breadcrumbs>
  );
}

export default BreadcrumbNav;


