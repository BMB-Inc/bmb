import { z } from 'zod/v4';

import { taskParamsSchema } from './task-params.schema';

export const getTasksDto = taskParamsSchema;
export type GetTasksDto = z.infer<typeof getTasksDto>;
