import { z } from 'zod/v4';

export const workflowStepFlagEnum = z.enum([
  'Production',
  'Debug',
  'Deleted',
  'Both',
  'LoadDetails',
]);

export const getWorkflowStepsDto = z.object({
  includeBuddies: z.boolean().optional(),
  flag: workflowStepFlagEnum.optional(),
});

export type GetWorkflowStepsDto = z.infer<typeof getWorkflowStepsDto>;
