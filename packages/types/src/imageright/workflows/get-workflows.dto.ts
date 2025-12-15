import { z } from 'zod/v4';

export const getWorkflowsDto = z.object({
  includeBuddies: z.boolean().optional(),
});

export type GetWorkflowsDto = z.infer<typeof getWorkflowsDto>;
