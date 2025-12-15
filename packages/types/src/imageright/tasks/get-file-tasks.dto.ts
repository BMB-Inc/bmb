import { z } from 'zod/v4';

import { taskParamsSchema } from './task-params.schema';

export const getFileTasksDto = taskParamsSchema.extend({
  fileId: z.number().nonnegative(),
});

export type GetFileTasksDto = z.infer<typeof getFileTasksDto>;
