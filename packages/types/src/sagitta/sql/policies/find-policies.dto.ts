import { z } from 'zod/v4';

export const findPoliciesQueryDto = z.object({
  clientId: z.coerce.number().optional().nullable(),
  clientName: z.string().optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  policyId: z.coerce.number().optional().nullable(),
  limit: z.coerce.number().int().min(1).optional().nullable(),
  page: z.coerce.number().int().min(0).optional().nullable(),
});

export type FindPoliciesQueryDto = z.infer<typeof findPoliciesQueryDto>;
