import type {
  ImagerightTask,
  ImagerightWorkflow,
  ImagerightWorkflowStep,
  FindTasksBodyDto,
} from '@bmb-inc/types';

export type TaskOrderBy = 
  | 'Priority'
  | 'AvailableDate'
  | 'DateInitiated'
  | 'FlowName'
  | 'FileNumber'
  | 'TaskId';

export type AgeCalculationAlgorithm = 
  | 'DateInitiated'
  | 'StepDuration'
  | 'AvailableDate';

export type WorkflowStepFlag =
  | 'Production'
  | 'Debug'
  | 'Deleted'
  | 'Both'
  | 'LoadDetails';

export interface TaskFilters extends FindTasksBodyDto {
  skip?: number;
  top?: number;
}

export interface WorkflowWithSteps extends ImagerightWorkflow {
  steps: ImagerightWorkflowStep[];
}

export interface TaskWorkflowViewerProps {
  /** Initial task filters to apply */
  initialTaskFilters?: Partial<TaskFilters>;
  /** Whether to include buddy workflows/steps */
  includeBuddies?: boolean;
  /** File ID to filter tasks by (for file-specific task view) */
  fileId?: number;
  /** Default view mode */
  defaultView?: 'tasks' | 'workflows';
  /** Whether to show the view toggle */
  showViewToggle?: boolean;
  /** Whether to show task filters panel */
  showFilters?: boolean;
  /** Callback when a task is selected */
  onTaskSelect?: (task: ImagerightTask) => void;
  /** Callback when a workflow is selected */
  onWorkflowSelect?: (workflow: ImagerightWorkflow) => void;
  /** Callback when a step is selected */
  onStepSelect?: (step: ImagerightWorkflowStep) => void;
  /** Page size for pagination */
  pageSize?: number;
  /** Custom class name */
  className?: string;
}

export interface TaskListProps {
  tasks: ImagerightTask[];
  isLoading: boolean;
  onTaskSelect?: (task: ImagerightTask) => void;
  selectedTaskId?: number;
}

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

export interface TaskFiltersFormProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  workflows: ImagerightWorkflow[];
  steps: ImagerightWorkflowStep[];
  isLoading?: boolean;
}


