import { useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Group,
  SegmentedControl,
  Card,
  Text,
  Pagination,
  Paper,
  Badge,
} from '@mantine/core';
import { IconListCheck, IconGitBranch } from '@tabler/icons-react';
import { useFileTasks, useFindTasks } from '../../hooks/useTasks';
import { useWorkflows } from '../../hooks/useWorkflows';
import { TaskFiltersForm } from './TaskFiltersForm';
import { TaskList } from './TaskList';
import { WorkflowList } from './WorkflowList';
import type {
  TaskWorkflowViewerProps,
  TaskFilters,
} from './types';
import type { ImagerightTask, ImagerightWorkflow, ImagerightWorkflowStep } from '@bmb-inc/types';

type ViewMode = 'tasks' | 'workflows';

export function TaskWorkflowViewer({
  initialTaskFilters = {},
  includeBuddies = false,
  fileId,
  defaultView = 'tasks',
  showViewToggle = true,
  showFilters = true,
  onTaskSelect,
  onWorkflowSelect,
  onStepSelect,
  pageSize = 50,
  className,
}: TaskWorkflowViewerProps) {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // Task filters state
  const [taskFilters, setTaskFilters] = useState<TaskFilters>({
    top: pageSize,
    ...initialTaskFilters,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Selection state
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | undefined>();
  const [selectedStepId, setSelectedStepId] = useState<number | undefined>();
  const [expandedWorkflowIds, setExpandedWorkflowIds] = useState<number[]>([]);

  // Only fetch workflows when viewing workflows tab (not for tasks view)
  const shouldFetchWorkflows = viewMode === 'workflows';

  // Fetch workflows (only when viewing workflows tab)
  // Steps are fetched on-demand when a workflow is expanded
  const {
    data: workflows = [],
    isLoading: workflowsLoading,
    error: workflowsError,
  } = useWorkflows({ includeBuddies }, shouldFetchWorkflows);

  // Build final task query params with pagination
  const taskQueryParams = useMemo(() => {
    return {
      ...taskFilters,
      skip: (currentPage - 1) * pageSize,
      top: pageSize,
    };
  }, [taskFilters, currentPage, pageSize]);

  // Fetch tasks - use file-specific endpoint if fileId is provided
  const {
    data: fileTasksData,
    isLoading: fileTasksLoading,
  } = useFileTasks(fileId ? { fileId, ...taskQueryParams } : undefined);

  const {
    data: generalTasksData,
    isLoading: generalTasksLoading,
  } = useFindTasks(
    !fileId ? { skip: taskQueryParams.skip, top: taskQueryParams.top } : undefined,
    !fileId ? taskFilters : undefined
  );

  // Determine which data/loading state to use
  const tasksData = fileId ? fileTasksData : generalTasksData?.items;
  const tasksLoading = fileId ? fileTasksLoading : generalTasksLoading;
  const totalTaskCount = fileId
    ? (fileTasksData?.length ?? 0)
    : (generalTasksData?.count ?? 0);
  const totalPages = Math.ceil(totalTaskCount / pageSize);

  // Handlers
  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setTaskFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleTaskSelect = useCallback(
    (task: ImagerightTask) => {
      setSelectedTaskId(task.id);
      onTaskSelect?.(task);
    },
    [onTaskSelect]
  );

  const handleWorkflowSelect = useCallback(
    (workflow: ImagerightWorkflow) => {
      setSelectedWorkflowId(workflow.id);
      onWorkflowSelect?.(workflow);
    },
    [onWorkflowSelect]
  );

  const handleStepSelect = useCallback(
    (step: ImagerightWorkflowStep) => {
      setSelectedStepId(step.id);
      onStepSelect?.(step);
    },
    [onStepSelect]
  );

  const handleToggleWorkflowExpand = useCallback((workflowId: number) => {
    setExpandedWorkflowIds((prev) =>
      prev.includes(workflowId)
        ? prev.filter((id) => id !== workflowId)
        : [...prev, workflowId]
    );
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Only show workflow errors if user is trying to view workflows
  const showWorkflowError = workflowsError && viewMode === 'workflows';

  return (
    <Card withBorder className={className}>
      <Stack gap="md">
        {/* Header with view toggle */}
        <Group justify="space-between">
          <Group gap="sm">
            <Text fw={600} size="lg">
              {fileId ? 'File Tasks' : 'Tasks & Workflows'}
            </Text>
            {fileId && (
              <Badge variant="light" color="blue">
                File #{fileId}
              </Badge>
            )}
          </Group>

          {showViewToggle && !fileId && (
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              data={[
                {
                  value: 'tasks',
                  label: (
                    <Group gap={6}>
                      <IconListCheck size={16} />
                      <span>Tasks</span>
                    </Group>
                  ),
                },
                {
                  value: 'workflows',
                  label: (
                    <Group gap={6}>
                      <IconGitBranch size={16} />
                      <span>Workflows</span>
                    </Group>
                  ),
                },
              ]}
            />
          )}
        </Group>

        {/* Error display - only show when viewing workflows */}
        {showWorkflowError && (
          <Paper p="sm" withBorder c="red">
            <Text c="red" size="sm">
              Error loading workflows: {workflowsError.message}
            </Text>
          </Paper>
        )}

        {/* Task Filters (only shown in tasks view or when fileId is set) */}
        {showFilters && (viewMode === 'tasks' || fileId) && (
          <TaskFiltersForm
            filters={taskFilters}
            onChange={handleFiltersChange}
            workflows={[]}
            steps={[]}
            isLoading={tasksLoading}
            collapsed={filtersCollapsed}
            onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
          />
        )}

        {/* Content based on view mode */}
        {viewMode === 'tasks' || fileId ? (
          <Stack gap="md">
            <TaskList
              tasks={tasksData || []}
              isLoading={tasksLoading}
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTaskId}
              totalCount={totalTaskCount}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Group justify="center">
                <Pagination
                  value={currentPage}
                  onChange={handlePageChange}
                  total={totalPages}
                  size="sm"
                  withEdges
                />
              </Group>
            )}
          </Stack>
        ) : (
          <WorkflowList
            workflows={workflows}
            isLoading={workflowsLoading}
            onWorkflowSelect={handleWorkflowSelect}
            onStepSelect={handleStepSelect}
            selectedWorkflowId={selectedWorkflowId}
            selectedStepId={selectedStepId}
            expandedWorkflowIds={expandedWorkflowIds}
            onToggleExpand={handleToggleWorkflowExpand}
          />
        )}
      </Stack>
    </Card>
  );
}

