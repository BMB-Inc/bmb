import { z } from 'zod/v4';

export const getIntegrationUrlDto = z.object({
  objectId: z.coerce.number().int(),
  integratedProduct: z.string().min(1),
  urlType: z.string().min(1),
  userId: z.string().min(1).optional(),
});

export type GetIntegrationUrlDto = z.infer<typeof getIntegrationUrlDto>;
