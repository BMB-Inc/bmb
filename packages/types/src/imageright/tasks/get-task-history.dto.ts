import { z } from "zod/v4";

export const getTaskHistoryDto = z.object({
  taskId: z.coerce.number().int().nonnegative().optional(),
  fileId: z.coerce.number().int().nonnegative().optional(),
  rangeStart: z.string().optional(),
  rangeEnd: z.string().optional(),
  filterLockUnlockOperations: z.boolean().optional(),
  limitResults: z.coerce.number().int().positive().optional(),
  fetchAllHistoryDetails: z.boolean().optional(),
});

export type GetTaskHistoryDto = z.infer<typeof getTaskHistoryDto>;
