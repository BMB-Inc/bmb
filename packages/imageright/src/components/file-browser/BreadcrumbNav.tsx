import { Breadcrumbs, Anchor, Group, Text } from '@mantine/core';
import { IconBuilding, IconChevronRight, IconFolder, IconUsers } from '@tabler/icons-react';

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
    <Breadcrumbs separator={<IconChevronRight size={14} color="var(--mantine-color-gray-6)" />}>
      <Anchor onClick={onClientsClick}>
        <Group gap={6} wrap="nowrap">
          <IconUsers size={14} />
          <span>Clients</span>
        </Group>
      </Anchor>
      {expandedClientId && (
        <Anchor onClick={onClientRootClick}>
          <Group gap={6} wrap="nowrap">
            <IconBuilding size={14} />
            <span>{clientLabel}</span>
          </Group>
        </Anchor>
      )}
      {folderId && (
        <Text size="sm">
          <Group gap={6} wrap="nowrap">
            <IconFolder size={14} />
            <span>{folderLabel}</span>
          </Group>
        </Text>
      )}
    </Breadcrumbs>
  );
}

export default BreadcrumbNav;


