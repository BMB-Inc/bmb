import { z } from 'zod/v4';

import { CoverageCode } from './policies.schema';

export const findPoliciesQueryDto = z.object({
  clientId: z.coerce.number().optional().nullable(),
  clientName: z.string().optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  includeCovCode: z.enum(CoverageCode).optional().nullable(),
  excludeCovCode: z.enum(CoverageCode).optional().nullable(),
  policyId: z.coerce.number().optional().nullable(),
  limit: z.coerce.number().int().min(1).optional().nullable(),
  page: z.coerce.number().int().min(0).optional().nullable(),
});

export type FindPoliciesQueryDto = z.infer<typeof findPoliciesQueryDto>;
