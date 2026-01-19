export * from './api';
export * from './hooks';
export * from './context';

// Main ImageRight browser component (now backed by v2)
export { ImageRightBrowser } from './components/ImageRightBrowser';
export type { ImageRightBrowserProps, ViewMode } from './components/ImageRightBrowser';
// Legacy v1 browser (kept for backwards-compat / migration support)
export { ImageRightBrowserV1 } from './components/ImageRightBrowserV1';
export type { ImageRightBrowserV1Props } from './components/ImageRightBrowserV1';

// v2 browser (cleaner composition root; incremental refactor target)
export { ImageRightBrowser2 } from './components/imageright-browser2/ImageRightBrowser2';
export type { ImageRightBrowser2Props, ActivePage } from './components/imageright-browser2/types';

// Individual view components (table-only or tree-only, without toggle)
export { FolderFileBrowser, ImageRightFileBrowser } from './components/file-browser/ImagerightFileBrowser';
export { FileTreeBrowser, TreeLoadingSkeleton } from './components/file-tree';

// Standalone preview/viewer components (usable independently of the browsers)
export { default as PdfPreview } from './components/file-browser/PdfPreview';
// Alias for consumers who prefer a "viewer" naming convention
export { default as PdfViewer } from './components/file-browser/PdfPreview';

// Task and workflow viewer components
export {
  TaskWorkflowViewer,
  TaskList,
  WorkflowList,
  TaskFiltersForm,
} from './components/task-workflow';
export type {
  TaskWorkflowViewerProps,
  TaskListProps,
  WorkflowListProps,
  TaskFiltersFormProps,
  TaskFilters,
  WorkflowWithSteps,
  TaskOrderBy,
  AgeCalculationAlgorithm,
  WorkflowStepFlag,
} from './components/task-workflow';
