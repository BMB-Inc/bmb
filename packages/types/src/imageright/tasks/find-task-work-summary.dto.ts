import { z } from "zod/v4";

export const findTaskWorkSummaryDto = z.object({
  flowIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  fileId: z.coerce.number().int().nonnegative().optional(),
  stepIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  userIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  rangeStart: z.string().optional(),
  rangeEnd: z.string().optional(),
  limitResults: z.coerce.number().int().positive().optional(),
  includeRouted: z.boolean().optional(),
});

export type FindTaskWorkSummaryDto = z.infer<typeof findTaskWorkSummaryDto>;
