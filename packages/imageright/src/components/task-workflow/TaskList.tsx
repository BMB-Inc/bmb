import {
  Table,
  Text,
  Badge,
  Skeleton,
  Stack,
  Group,
  Paper,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IconFile, IconClock, IconFlag, IconEye } from '@tabler/icons-react';
import type { ImagerightTask } from '@bmb-inc/types';

export interface TaskListProps {
  tasks: ImagerightTask[];
  isLoading: boolean;
  onTaskSelect?: (task: ImagerightTask) => void;
  selectedTaskId?: number;
  totalCount?: number;
}

const STATUS_COLORS: Record<number, string> = {
  0: 'blue',   // Available
  1: 'yellow', // Locked
  2: 'green',  // Completed
  3: 'red',    // Cancelled
};

const STATUS_LABELS: Record<number, string> = {
  0: 'Available',
  1: 'Locked',
  2: 'Completed',
  3: 'Cancelled',
};

function formatDate(date: Date | string | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TaskRow({
  task,
  onSelect,
  isSelected,
}: {
  task: ImagerightTask;
  onSelect?: () => void;
  isSelected: boolean;
}) {
  const priorityColor = task.priority <= 1 ? 'red' : task.priority <= 3 ? 'yellow' : 'gray';

  return (
    <Table.Tr
      onClick={onSelect}
      style={{
        cursor: onSelect ? 'pointer' : 'default',
        background: isSelected ? 'var(--mantine-color-blue-light)' : undefined,
        transition: 'background-color 150ms ease',
      }}
      className="task-row"
    >
      <Table.Td>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            {task.id}
          </Text>
          {task.debug && (
            <Badge size="xs" color="orange" variant="light">
              Debug
            </Badge>
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <Stack gap={2}>
          <Text size="sm" fw={500} lineClamp={1}>
            {task.flowName}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {task.stepName}
          </Text>
        </Stack>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <IconFile size={14} style={{ opacity: 0.6 }} />
          <Stack gap={0}>
            <Text size="sm" lineClamp={1}>
              {task.fileName || task.fileNumber}
            </Text>
            {task.fileName && task.fileNumber && (
              <Text size="xs" c="dimmed">
                {task.fileNumber}
              </Text>
            )}
          </Stack>
        </Group>
      </Table.Td>
      <Table.Td>
        <Tooltip label={`Priority: ${task.priority}`}>
          <Badge
            color={priorityColor}
            variant="light"
            size="sm"
            leftSection={<IconFlag size={10} />}
          >
            {task.priority}
          </Badge>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Badge color={STATUS_COLORS[task.status] || 'gray'} variant="filled" size="sm">
          {STATUS_LABELS[task.status] || `Status ${task.status}`}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <IconClock size={14} style={{ opacity: 0.6 }} />
          <Text size="sm">{formatDate(task.availableDate)}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {formatDate(task.dateInitiated)}
        </Text>
      </Table.Td>
      <Table.Td>
        {onSelect && (
          <Tooltip label="View task details">
            <ActionIcon variant="subtle" size="sm" onClick={onSelect}>
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Table.Td>
    </Table.Tr>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Table.Tr key={i}>
          <Table.Td><Skeleton height={20} width={60} /></Table.Td>
          <Table.Td>
            <Stack gap={4}>
              <Skeleton height={16} width={120} />
              <Skeleton height={12} width={80} />
            </Stack>
          </Table.Td>
          <Table.Td><Skeleton height={20} width={150} /></Table.Td>
          <Table.Td><Skeleton height={20} width={40} /></Table.Td>
          <Table.Td><Skeleton height={20} width={70} /></Table.Td>
          <Table.Td><Skeleton height={20} width={90} /></Table.Td>
          <Table.Td><Skeleton height={20} width={90} /></Table.Td>
          <Table.Td><Skeleton height={24} width={24} radius="sm" /></Table.Td>
        </Table.Tr>
      ))}
    </>
  );
}

export function TaskList({
  tasks,
  isLoading,
  onTaskSelect,
  selectedTaskId,
  totalCount,
}: TaskListProps) {
  const displayCount = totalCount ?? tasks.length;

  return (
    <Paper withBorder style={{ overflow: 'hidden' }}>
      <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Text size="sm" fw={500}>
          Tasks
        </Text>
        <Text size="xs" c="dimmed">
          {isLoading ? 'Loading...' : `${tasks.length}${displayCount > tasks.length ? ` of ${displayCount}` : ''} task${displayCount !== 1 ? 's' : ''}`}
        </Text>
      </Group>
      
      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 80 }}>ID</Table.Th>
              <Table.Th style={{ width: 180 }}>Workflow / Step</Table.Th>
              <Table.Th>File</Table.Th>
              <Table.Th style={{ width: 80 }}>Priority</Table.Th>
              <Table.Th style={{ width: 100 }}>Status</Table.Th>
              <Table.Th style={{ width: 120 }}>Available</Table.Th>
              <Table.Th style={{ width: 120 }}>Initiated</Table.Th>
              <Table.Th style={{ width: 50 }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : tasks.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center" c="dimmed" py="xl">
                    No tasks found matching your criteria
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onSelect={onTaskSelect ? () => onTaskSelect(task) : undefined}
                  isSelected={selectedTaskId === task.id}
                />
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}

