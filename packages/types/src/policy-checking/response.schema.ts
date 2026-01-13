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
  parsed_result: policyCheckParsedResultSchema.nullable(),
  parsed_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
});

export const policyCheckDocumentMetadataSchema = z.object({
  id: z.string(),
  documentId: z.number().int().nullable(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  createdAt: z.coerce.date(),
});

export const policyCheckEmailSummarySchema = z.object({
  id: z.string(),
  direction: z.enum(['outbound', 'inbound']),
  subject: z.string(),
  conversationId: z.string().nullable(),
  graphMessageId: z.string().nullable(),
  internetMessageId: z.string().nullable(),
  sentAt: z.coerce.date().nullable(),
  receivedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export const policyCheckResponseDetailSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  emailId: z.string(),
  rawBody: z.string().nullable(),
  parsedResult: policyCheckParsedResultSchema.nullable(),
  receivedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});

export const exportPolicyCheckResponseSchema = z.object({
  responseId: z.string(),
  folderId: z.number().int(),
  filename: z.string().min(1).optional(),
});

export const exportPolicyCheckResponsePreviewSchema = z.object({
  responseId: z.string(),
  filename: z.string().min(1).optional(),
});

export const policyCheckResponseExportSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  responseId: z.string(),
  folderId: z.number().int(),
  documentTypeId: z.number().int(),
  documentId: z.number().int(),
  pageId: z.number().int(),
  filename: z.string(),
  errorMessage: z.string().nullable(),
  createdByUserId: z.string(),
  createdAt: z.coerce.date(),
});

export const checkResponseResultSchema = z.object({
  found: z.boolean(),
  response: z
    .object({
      id: z.string(),
      rawBody: z.string().nullable(),
      receivedAt: z.coerce.date().nullable(),
      parsedResult: policyCheckParsedResultSchema.nullable().optional(),
    })
    .optional(),
});

export const policyCheckRequestSummarySchema = z.object({
  id: z.string(),
  clientId: z.number().int().nullable(),
  folderId: z.number().int().nullable(),
  policyId: z.number().int().nullable(),
  taskId: z.number().int().nullable(),
  emailTemplateId: z.string().nullable(),
  status: z.enum(['pending', 'sent', 'responded', 'failed']),
  createdByUserId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  documents: z.array(policyCheckDocumentMetadataSchema),
  requestBody: z.string().nullable().optional(),
  email: z
    .object({
      conversationId: z.string().nullable(),
      sentAt: z.coerce.date().nullable(),
    })
    .optional(),
  latestResponse: policyCheckResponseDetailSchema.optional(),
});

export const policyCheckRequestWithDetailsSchema = z.object({
  id: z.string(),
  clientId: z.number().int().nullable(),
  folderId: z.number().int().nullable(),
  policyId: z.number().int().nullable(),
  taskId: z.number().int().nullable(),
  emailTemplateId: z.string().nullable(),
  status: z.enum(['pending', 'sent', 'responded', 'failed']),
  createdByUserId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  documents: z.array(policyCheckDocumentMetadataSchema),
  emails: z.array(policyCheckEmailSummarySchema),
  responses: z.array(policyCheckResponseDetailSchema),
  requestBody: z.string().nullable().optional(),
  email: z
    .object({
      conversationId: z.string().nullable(),
      sentAt: z.coerce.date().nullable(),
    })
    .optional(),
  response: z
    .object({
      receivedAt: z.coerce.date().nullable(),
      rawBody: z.string().nullable(),
      parsedResult: policyCheckParsedResultSchema.nullable().optional(),
    })
    .optional(),
});

export type PolicyCheckResponse = z.infer<typeof policyCheckResponseSchema>;
export type PolicyCheckParsedResult = z.infer<typeof policyCheckParsedResultSchema>;
export type PolicyCheckComparisonRow = z.infer<typeof comparisonRowSchema>;
export type CheckResponseResult = z.infer<typeof checkResponseResultSchema>;
export type ExportPolicyCheckResponse = z.infer<typeof exportPolicyCheckResponseSchema>;
export type ExportPolicyCheckResponsePreview = z.infer<
  typeof exportPolicyCheckResponsePreviewSchema
>;
export type PolicyCheckDocumentMetadata = z.infer<typeof policyCheckDocumentMetadataSchema>;
export type PolicyCheckEmailSummary = z.infer<typeof policyCheckEmailSummarySchema>;
export type PolicyCheckResponseDetail = z.infer<typeof policyCheckResponseDetailSchema>;
export type PolicyCheckResponseExport = z.infer<typeof policyCheckResponseExportSchema>;
export type PolicyCheckRequestSummary = z.infer<typeof policyCheckRequestSummarySchema>;
export type PolicyCheckRequestWithDetails = z.infer<typeof policyCheckRequestWithDetailsSchema>;
