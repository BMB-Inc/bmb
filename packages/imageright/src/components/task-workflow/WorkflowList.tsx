import { useState } from 'react';
import {
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  Collapse,
  UnstyledButton,
  Skeleton,
  Box,
  Divider,
  Tooltip,
} from '@mantine/core';
import {
  IconChevronRight,
  IconChevronDown,
  IconPlayerPlay,
  IconCheck,
  IconBug,
} from '@tabler/icons-react';
import type { ImagerightWorkflow, ImagerightWorkflowStep } from '@bmb-inc/types';
import { useWorkflowSteps } from '../../hooks/useWorkflows';

export interface WorkflowListProps {
  workflows: ImagerightWorkflow[];
  isLoading: boolean;
  onWorkflowSelect?: (workflow: ImagerightWorkflow) => void;
  onStepSelect?: (step: ImagerightWorkflowStep) => void;
  selectedWorkflowId?: number;
  selectedStepId?: number;
  expandedWorkflowIds?: number[];
  onToggleExpand?: (workflowId: number) => void;
}

function StepItem({
  step,
  onSelect,
  isSelected,
}: {
  step: ImagerightWorkflowStep;
  onSelect?: () => void;
  isSelected: boolean;
}) {
  return (
    <UnstyledButton
      onClick={onSelect}
      style={{
        width: '100%',
        padding: '8px 12px',
        paddingLeft: 32,
        borderRadius: 4,
        background: isSelected ? 'var(--mantine-color-blue-light)' : 'transparent',
        transition: 'background-color 150ms ease',
      }}
      className="step-item"
    >
      <Group gap="sm" justify="space-between">
        <Group gap="xs">
          {step.isStart && (
            <Tooltip label="Start step">
              <IconPlayerPlay size={14} color="var(--mantine-color-green-5)" />
            </Tooltip>
          )}
          {step.isValidation && (
            <Tooltip label="Validation step">
              <IconCheck size={14} color="var(--mantine-color-blue-5)" />
            </Tooltip>
          )}
          <Text size="sm">{step.name}</Text>
        </Group>
        <Group gap={6}>
          {step.debug && (
            <Badge size="xs" color="orange" variant="light" leftSection={<IconBug size={10} />}>
              Debug
            </Badge>
          )}
          <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
            {step.progName}
          </Text>
        </Group>
      </Group>
    </UnstyledButton>
  );
}

function StepsLoadingSkeleton() {
  return (
    <Stack gap={4}>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} height={32} radius="sm" />
      ))}
    </Stack>
  );
}

function WorkflowSteps({
  workflowId,
  isExpanded,
  onStepSelect,
  selectedStepId,
}: {
  workflowId: number;
  isExpanded: boolean;
  onStepSelect?: (step: ImagerightWorkflowStep) => void;
  selectedStepId?: number;
}) {
  // Only fetch steps when expanded
  const { data: steps, isLoading, error } = useWorkflowSteps(workflowId, undefined, isExpanded);

  if (isLoading) {
    return <StepsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Text size="sm" c="red" ta="center" py="sm">
        Failed to load steps
      </Text>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="sm">
        No steps found
      </Text>
    );
  }

  return (
    <>
      {steps.map((step) => (
        <StepItem
          key={step.id}
          step={step}
          onSelect={onStepSelect ? () => onStepSelect(step) : undefined}
          isSelected={selectedStepId === step.id}
        />
      ))}
    </>
  );
}

function WorkflowItem({
  workflow,
  isExpanded,
  onToggle,
  onWorkflowSelect,
  onStepSelect,
  selectedStepId,
  isSelected,
}: {
  workflow: ImagerightWorkflow;
  isExpanded: boolean;
  onToggle: () => void;
  onWorkflowSelect?: () => void;
  onStepSelect?: (step: ImagerightWorkflowStep) => void;
  selectedStepId?: number;
  isSelected: boolean;
}) {
  return (
    <Box
      style={{
        borderRadius: 6,
        border: isSelected
          ? '1px solid var(--mantine-color-blue-6)'
          : '1px solid var(--mantine-color-default-border)',
        overflow: 'hidden',
        background: isSelected ? 'var(--mantine-color-blue-light)' : 'var(--mantine-color-body)',
      }}
    >
      <UnstyledButton
        onClick={() => {
          onToggle();
          onWorkflowSelect?.();
        }}
        style={{
          width: '100%',
          padding: '12px 16px',
          transition: 'background-color 150ms ease',
        }}
        className="workflow-item"
      >
        <Group justify="space-between">
          <Group gap="sm">
            {isExpanded ? (
              <IconChevronDown size={18} style={{ opacity: 0.6 }} />
            ) : (
              <IconChevronRight size={18} style={{ opacity: 0.6 }} />
            )}
            <Stack gap={2}>
              <Text size="sm" fw={600}>
                {workflow.name}
              </Text>
              <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                {workflow.flowProgName}
              </Text>
            </Stack>
          </Group>
        </Group>
      </UnstyledButton>

      <Collapse in={isExpanded}>
        <Divider />
        <Stack gap={4} p="xs">
          <WorkflowSteps
            workflowId={workflow.id}
            isExpanded={isExpanded}
            onStepSelect={onStepSelect}
            selectedStepId={selectedStepId}
          />
        </Stack>
      </Collapse>
    </Box>
  );
}

function LoadingSkeleton() {
  return (
    <Stack gap="md">
      {[...Array(3)].map((_, i) => (
        <Paper key={i} p="md" withBorder>
          <Group justify="space-between">
            <Group gap="sm">
              <Skeleton height={18} width={18} />
              <Stack gap={4}>
                <Skeleton height={16} width={180} />
                <Skeleton height={12} width={100} />
              </Stack>
            </Group>
            <Skeleton height={20} width={60} />
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export function WorkflowList({
  workflows,
  isLoading,
  onWorkflowSelect,
  onStepSelect,
  selectedWorkflowId,
  selectedStepId,
  expandedWorkflowIds: controlledExpanded,
  onToggleExpand: controlledToggle,
}: WorkflowListProps) {
  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState<number[]>([]);

  const expandedIds = controlledExpanded ?? internalExpanded;
  const handleToggle = controlledToggle ?? ((id: number) => {
    setInternalExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  });

  return (
    <Paper withBorder style={{ overflow: 'hidden' }}>
      <Group
        justify="space-between"
        p="sm"
        style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
      >
        <Text size="sm" fw={500}>
          Workflows
        </Text>
        <Text size="xs" c="dimmed">
          {isLoading
            ? 'Loading...'
            : `${workflows.length} workflow${workflows.length !== 1 ? 's' : ''}`}
        </Text>
      </Group>

      <Stack gap="sm" p="sm">
        {isLoading ? (
          <LoadingSkeleton />
        ) : workflows.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            No workflows found
          </Text>
        ) : (
          workflows.map((workflow) => (
            <WorkflowItem
              key={workflow.id}
              workflow={workflow}
              isExpanded={expandedIds.includes(workflow.id)}
              onToggle={() => handleToggle(workflow.id)}
              onWorkflowSelect={
                onWorkflowSelect ? () => onWorkflowSelect(workflow) : undefined
              }
              onStepSelect={onStepSelect}
              selectedStepId={selectedStepId}
              isSelected={selectedWorkflowId === workflow.id}
            />
          ))
        )}
      </Stack>
    </Paper>
  );
}
