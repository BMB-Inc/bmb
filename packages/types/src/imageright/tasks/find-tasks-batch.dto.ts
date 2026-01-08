import { z } from 'zod/v4';

import { taskFilterSchema } from './task-params.schema';

export const taskBatchDirectionEnum = z.enum(['Forward', 'Backward']);

export const taskBatchTreeNodeSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  children: z.array(z.coerce.number().int().nonnegative()).optional(),
});

export const findTasksBatchQueryDto = z.object({
  rowNumStartFrom: z.coerce.number().int().min(-1).optional(),
  batchSize: z.coerce.number().int().positive().optional(),
});

export type FindTasksBatchQueryDto = z.infer<typeof findTasksBatchQueryDto>;

export const findTasksBatchBodyDto = taskFilterSchema.extend({
  includeLocked: z.boolean().optional(),
  skippedTasks: z.array(z.coerce.number().int().nonnegative()).nonempty().optional(),
  fileId: z.coerce.number().int().nonnegative().optional(),
  drawerFileTypesTree: z.array(taskBatchTreeNodeSchema).optional(),
  flowStepsTree: z.array(taskBatchTreeNodeSchema).optional(),
  stepDurationSteps: z.array(z.coerce.number().int().nonnegative()).nonempty().optional(),
  showFutureTasks: z.boolean().optional(),
  direction: taskBatchDirectionEnum.optional(),
});

export type FindTasksBatchBodyDto = z.infer<typeof findTasksBatchBodyDto>;
export type TaskBatchTreeNode = z.infer<typeof taskBatchTreeNodeSchema>;
export type TaskBatchDirection = z.infer<typeof taskBatchDirectionEnum>;
