import z from 'zod/v4';

export enum PolicyCheckRequestStatus {
  PENDING = 'pending',
  SENT = 'sent',
  RESPONDED = 'responded',
  FAILED = 'failed',
}

const requestStatusValues: [PolicyCheckRequestStatus, ...PolicyCheckRequestStatus[]] = [
  PolicyCheckRequestStatus.PENDING,
  PolicyCheckRequestStatus.SENT,
  PolicyCheckRequestStatus.RESPONDED,
  PolicyCheckRequestStatus.FAILED,
];

export const policyCheckRequestSchema = z.object({
  id: z.uuid(),
  client_id: z.number().int().nullable(),
  folder_id: z.number().int().nullable(),
  policy_id: z.number().int().nullable(),
  status: z.enum(requestStatusValues),
  created_by_user_id: z.uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const policyCheckImportSchema = z.object({
  id: z.string().uuid(),
  policyId: z.number().int(),
  clientId: z.number().int().nullable(),
  folderId: z.number().int().nullable(),
  documentId: z.number().int().nullable(),
  pageIds: z.array(z.number().int()).optional(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  createdAt: z.coerce.date(),
});

export const policyCheckImportsSchema = z.array(policyCheckImportSchema);

export const importDocumentInputSchema = z.object({
  clientId: z.number().int(),
  folderId: z.number().int(),
  documentId: z.number().int(),
  pageIds: z
    .array(z.number().int())
    .min(1, { message: 'At least one pageId must be provided when pageIds is supplied.' })
    .optional(),
});

export const createPolicyCheckImportSchema = z.object({
  documents: z.array(importDocumentInputSchema).min(1),
});

export const uploadPolicyCheckDocumentSchema = z.object({
  clientId: z.number().int().optional(),
  folderId: z.number().int().optional(),
  policyId: z.number().int(),
});

export const createPolicyCheckRequestSchema = z.object({
  importIds: z.array(z.string().uuid()).min(1),
});

export type PolicyCheckRequest = z.infer<typeof policyCheckRequestSchema>;
export type PolicyCheckImport = z.infer<typeof policyCheckImportSchema>;
export type PolicyCheckImports = z.infer<typeof policyCheckImportsSchema>;
export type ImportDocumentInput = z.infer<typeof importDocumentInputSchema>;
export type CreatePolicyCheckImport = z.infer<typeof createPolicyCheckImportSchema>;
export type CreatePolicyCheckRequest = z.infer<typeof createPolicyCheckRequestSchema>;
export type UploadPolicyCheckDocument = z.infer<typeof uploadPolicyCheckDocumentSchema>;
