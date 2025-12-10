import { Group, Skeleton, Stack } from '@mantine/core';

export function TreeLoadingSkeleton() {
  return (
    <Stack gap="xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <Group key={`skeleton-${i}`} gap="xs" py={6} px={8}>
          <Skeleton height={16} width={16} radius="sm" />
          <Skeleton height={16} width={16} radius="sm" />
          <Skeleton height={14} width={`${60 - i * 8}%`} radius="sm" />
        </Group>
      ))}
    </Stack>
  );
}

export default TreeLoadingSkeleton;

