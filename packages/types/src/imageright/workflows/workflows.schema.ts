import { z } from 'zod/v4';

export const imagerightWorkflowSchema = z.object({
  id: z.number(),
  name: z.string(),
  flowProgName: z.string(),
});

export type ImagerightWorkflow = z.infer<typeof imagerightWorkflowSchema>;

export const imagerightWorkflowStepSchema = z.object({
  id: z.number(),
  name: z.string(),
  typeGuid: z.string(),
  debug: z.boolean(),
  isStart: z.boolean(),
  isValidation: z.boolean(),
  progName: z.string(),
  flowId: z.number(),
});

export type ImagerightWorkflowStep = z.infer<typeof imagerightWorkflowStepSchema>;
