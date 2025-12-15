import { z } from 'zod/v4';

import { taskFilterSchema } from './task-params.schema';

export const findTasksQueryDto = z.object({
  skip: z.coerce.number().nonnegative().optional(),
  top: z.coerce.number().positive().optional(),
});

export type FindTasksQueryDto = z.infer<typeof findTasksQueryDto>;

export const findTasksBodyDto = taskFilterSchema;
export type FindTasksBodyDto = z.infer<typeof findTasksBodyDto>;
