import { z } from 'zod/v4';

export const ageCalculationAlgorithmEnum = z.enum([
  'DateInitiated',
  'StepDuration',
  'AvailableDate',
]);

export const taskOrderByEnum = z.enum([
  'Priority',
  'AvailableDate',
  'DateInitiated',
  'FlowName',
  'FileNumber',
  'TaskId',
]);

export const ageModelSetSchema = z.object({
  id: z.coerce.number().optional(),
  from: z.coerce.number().optional(),
  to: z.coerce.number().optional(),
});

export const flowsStepsBuddiesSchema = z.record(z.array(z.coerce.number()).nonempty());

export const taskFilterSchema = z.object({
  tasks: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  availableDateStart: z.string().optional(),
  availableDateEnd: z.string().optional(),
  flows: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  excludeFlows: z.boolean().optional(),
  steps: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  excludeSteps: z.boolean().optional(),
  assignedTo: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  ageModelSet: z.array(ageModelSetSchema).nonempty().optional(),
  ageCalculationAlgorithm: ageCalculationAlgorithmEnum.optional(),
  taskStatus: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  excludeStatus: z.boolean().optional(),
  lockable: z.boolean().optional(),
  orderBy: taskOrderByEnum.optional(),
  lockedBy: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  debug: z.boolean().optional(),
  fileTypes: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  excludeFileTypes: z.boolean().optional(),
  drawers: z.array(z.coerce.number().nonnegative()).nonempty().optional(),
  excludeDrawers: z.boolean().optional(),
  flowsStepsBuddies: flowsStepsBuddiesSchema.optional(),
});

export const taskParamsSchema = taskFilterSchema.extend({
  skip: z.coerce.number().nonnegative().optional(),
  top: z.coerce.number().positive().optional(),
});

export type ImagerightTaskFilter = z.infer<typeof taskFilterSchema>;
export type ImagerightTaskParams = z.infer<typeof taskParamsSchema>;
