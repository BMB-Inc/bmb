import { useState, useCallback } from 'react';
import {
  Stack,
  Group,
  Select,
  MultiSelect,
  NumberInput,
  Switch,
  Button,
  Collapse,
  Paper,
  Text,
  Divider,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconFilter, IconFilterOff, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { ImagerightWorkflow, ImagerightWorkflowStep } from '@bmb-inc/types';
import type { TaskFilters, TaskOrderBy, AgeCalculationAlgorithm } from './types';

export interface TaskFiltersFormProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  workflows: ImagerightWorkflow[];
  steps: ImagerightWorkflowStep[];
  isLoading?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ORDER_BY_OPTIONS: { value: TaskOrderBy; label: string }[] = [
  { value: 'Priority', label: 'Priority' },
  { value: 'AvailableDate', label: 'Available Date' },
  { value: 'DateInitiated', label: 'Date Initiated' },
  { value: 'FlowName', label: 'Workflow Name' },
  { value: 'FileNumber', label: 'File Number' },
  { value: 'TaskId', label: 'Task ID' },
];

const AGE_ALGORITHM_OPTIONS: { value: AgeCalculationAlgorithm; label: string }[] = [
  { value: 'DateInitiated', label: 'Date Initiated' },
  { value: 'StepDuration', label: 'Step Duration' },
  { value: 'AvailableDate', label: 'Available Date' },
];

export function TaskFiltersForm({
  filters,
  onChange,
  workflows,
  steps,
  isLoading,
  collapsed = false,
  onToggleCollapse,
}: TaskFiltersFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generate workflow options
  const workflowOptions = workflows.map((w) => ({
    value: w.id.toString(),
    label: w.name,
  }));

  // Generate step options (filtered by selected workflows if any)
  const selectedFlowIds = filters.flows || [];
  const filteredSteps = selectedFlowIds.length > 0
    ? steps.filter((s) => selectedFlowIds.includes(s.flowId))
    : steps;
  
  const stepOptions = filteredSteps.map((s) => ({
    value: s.id.toString(),
    label: `${s.name}${s.debug ? ' (Debug)' : ''}`,
  }));

  const handleChange = useCallback(
    <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
      onChange({ ...filters, [key]: value });
    },
    [filters, onChange]
  );

  const handleMultiSelectChange = useCallback(
    (key: 'flows' | 'steps' | 'assignedTo' | 'taskStatus' | 'lockedBy' | 'fileTypes' | 'drawers', values: string[]) => {
      const numericValues = values.length > 0 ? values.map(Number) : undefined;
      onChange({ ...filters, [key]: numericValues });
    },
    [filters, onChange]
  );

  const handleClearFilters = useCallback(() => {
    onChange({});
  }, [onChange]);

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof TaskFilters] !== undefined
  );

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb={collapsed ? 0 : 'md'}>
        <Group gap="xs">
          <IconFilter size={18} />
          <Text fw={500} size="sm">Task Filters</Text>
          {hasActiveFilters && (
            <Text size="xs" c="dimmed">
              (Active)
            </Text>
          )}
        </Group>
        <Group gap="xs">
          {hasActiveFilters && (
            <Tooltip label="Clear all filters">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                <IconFilterOff size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          {onToggleCollapse && (
            <ActionIcon variant="subtle" onClick={onToggleCollapse}>
              {collapsed ? <IconChevronDown size={16} /> : <IconChevronUp size={16} />}
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Collapse in={!collapsed}>
        <Stack gap="md">
          {/* Primary Filters */}
          <Group grow align="flex-start">
            <MultiSelect
              label="Workflows"
              placeholder="All workflows"
              data={workflowOptions}
              value={(filters.flows || []).map(String)}
              onChange={(values) => handleMultiSelectChange('flows', values)}
              searchable
              clearable
              disabled={isLoading}
            />
            <MultiSelect
              label="Steps"
              placeholder="All steps"
              data={stepOptions}
              value={(filters.steps || []).map(String)}
              onChange={(values) => handleMultiSelectChange('steps', values)}
              searchable
              clearable
              disabled={isLoading}
            />
          </Group>

          <Group grow align="flex-start">
            <Select
              label="Order By"
              placeholder="Default order"
              data={ORDER_BY_OPTIONS}
              value={filters.orderBy || null}
              onChange={(value) => handleChange('orderBy', value as TaskOrderBy | undefined)}
              clearable
              disabled={isLoading}
            />
            <Group grow>
              <NumberInput
                label="Skip"
                placeholder="0"
                value={filters.skip ?? ''}
                onChange={(value) => handleChange('skip', typeof value === 'number' ? value : undefined)}
                min={0}
                disabled={isLoading}
              />
              <NumberInput
                label="Top"
                placeholder="100"
                value={filters.top ?? ''}
                onChange={(value) => handleChange('top', typeof value === 'number' ? value : undefined)}
                min={1}
                disabled={isLoading}
              />
            </Group>
          </Group>

          {/* Date Range Filters */}
          <Group grow align="flex-start">
            <DateInput
              label="Available Date Start"
              placeholder="Start date"
              value={filters.availableDateStart ? new Date(filters.availableDateStart) : null}
              onChange={(date) =>
                handleChange('availableDateStart', date ? date?.toString() : undefined)
              }
              clearable
              disabled={isLoading}
            />
            <DateInput
              label="Available Date End"
              placeholder="End date"
              value={filters.availableDateEnd ? new Date(filters.availableDateEnd) : null}
              onChange={(date) =>
                handleChange('availableDateEnd', date ? date?.toString() : undefined)
              }
              clearable
              disabled={isLoading}
            />
          </Group>

          {/* Toggle for advanced filters */}
          <Button
            variant="subtle"
            size="xs"
            onClick={() => setShowAdvanced(!showAdvanced)}
            rightSection={showAdvanced ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </Button>

          <Collapse in={showAdvanced}>
            <Stack gap="md">
              <Divider label="Advanced Filters" labelPosition="center" />

              {/* Exclusion toggles */}
              <Group>
                <Switch
                  label="Exclude selected workflows"
                  checked={filters.excludeFlows ?? false}
                  onChange={(e) => handleChange('excludeFlows', e.currentTarget.checked || undefined)}
                  disabled={isLoading || !filters.flows?.length}
                />
                <Switch
                  label="Exclude selected steps"
                  checked={filters.excludeSteps ?? false}
                  onChange={(e) => handleChange('excludeSteps', e.currentTarget.checked || undefined)}
                  disabled={isLoading || !filters.steps?.length}
                />
              </Group>

              <Group>
                <Switch
                  label="Lockable tasks only"
                  checked={filters.lockable ?? false}
                  onChange={(e) => handleChange('lockable', e.currentTarget.checked || undefined)}
                  disabled={isLoading}
                />
                <Switch
                  label="Debug tasks"
                  checked={filters.debug ?? false}
                  onChange={(e) => handleChange('debug', e.currentTarget.checked || undefined)}
                  disabled={isLoading}
                />
              </Group>

              {/* Age calculation */}
              <Select
                label="Age Calculation Algorithm"
                placeholder="Default"
                data={AGE_ALGORITHM_OPTIONS}
                value={filters.ageCalculationAlgorithm || null}
                onChange={(value) =>
                  handleChange('ageCalculationAlgorithm', value as AgeCalculationAlgorithm | undefined)
                }
                clearable
                disabled={isLoading}
              />

              {/* Additional multi-selects */}
              <Group grow align="flex-start">
                <MultiSelect
                  label="Task Status"
                  placeholder="All statuses"
                  data={[
                    { value: '0', label: 'Available (0)' },
                    { value: '1', label: 'Locked (1)' },
                    { value: '2', label: 'Completed (2)' },
                    { value: '3', label: 'Cancelled (3)' },
                  ]}
                  value={(filters.taskStatus || []).map(String)}
                  onChange={(values) => handleMultiSelectChange('taskStatus', values)}
                  clearable
                  disabled={isLoading}
                />
                <Switch
                  label="Exclude selected status"
                  checked={filters.excludeStatus ?? false}
                  onChange={(e) => handleChange('excludeStatus', e.currentTarget.checked || undefined)}
                  disabled={isLoading || !filters.taskStatus?.length}
                  style={{ alignSelf: 'flex-end', marginBottom: 8 }}
                />
              </Group>
            </Stack>
          </Collapse>
        </Stack>
      </Collapse>
    </Paper>
  );
}

