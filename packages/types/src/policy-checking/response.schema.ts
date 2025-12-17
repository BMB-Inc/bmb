import z from 'zod/v4';

const comparisonRowSchema = z.object({
  item: z.string(),
  newPolicy: z.string().nullable(),
  discrepancy: z.string().nullable(),
});

const nestedSectionSchema = z.record(z.string(), z.array(z.string()));

export const policyCheckParsedResultSchema = z.object({
  textContent: z.string().optional(),
  policyComparison: z.array(comparisonRowSchema).optional(),
  coverageComparison: z.array(comparisonRowSchema).optional(),
  namedInsureds: nestedSectionSchema.optional(),
  coveredLocations: nestedSectionSchema.optional(),
  formComparison: nestedSectionSchema.optional(),
  additionalConsiderations: z.array(z.string()).optional(),
  receivedAt: z.string().optional(),
});

export const policyCheckResponseSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  email_id: z.uuid(),
  raw_body: z.string().nullable(),
  parsed_result: z.string().nullable(),
  parsed_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
});

export const checkResponseResultSchema = z.object({
  found: z.boolean(),
  response: z
    .object({
      id: z.string(),
      rawBody: z.string().nullable(),
      parsedResult: policyCheckParsedResultSchema.nullable(),
      receivedAt: z.coerce.date().nullable(),
    })
    .optional(),
});

export const policyCheckRequestWithDetailsSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  folderId: z.number().int(),
  policyId: z.number().int().nullable(),
  status: z.enum(['pending', 'sent', 'responded', 'failed']),
  createdByUserId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  documents: z.array(
    z.object({
      id: z.string(),
      filename: z.string(),
      contentType: z.string(),
      size: z.number().int(),
    }),
  ),
  email: z
    .object({
      conversationId: z.string().nullable(),
      sentAt: z.coerce.date().nullable(),
    })
    .optional(),
  response: z
    .object({
      receivedAt: z.coerce.date().nullable(),
      parsedResult: policyCheckParsedResultSchema.nullable(),
    })
    .optional(),
});

export type PolicyCheckResponse = z.infer<typeof policyCheckResponseSchema>;
export type PolicyCheckParsedResult = z.infer<typeof policyCheckParsedResultSchema>;
export type PolicyCheckComparisonRow = z.infer<typeof comparisonRowSchema>;
export type CheckResponseResult = z.infer<typeof checkResponseResultSchema>;
export type PolicyCheckRequestWithDetails = z.infer<typeof policyCheckRequestWithDetailsSchema>;
