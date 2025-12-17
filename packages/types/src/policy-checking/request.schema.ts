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
  client_id: z.number().int(),
  folder_id: z.number().int(),
  policy_id: z.string().nullable(),
  status: z.enum(requestStatusValues),
  created_by_user_id: z.uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const policyCheckImportSchema = z.object({
  id: z.string().uuid(),
  policyId: z.string().min(1),
  clientId: z.number().int(),
  folderId: z.number().int(),
  documentId: z.number().int(),
  pageIds: z.array(z.number().int()).optional(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number().int(),
  createdAt: z.coerce.date(),
});

export const createPolicyCheckImportSchema = z.object({
  clientId: z.number().int(),
  folderId: z.number().int(),
  documentId: z.number().int(),
  pageIds: z
    .array(z.number().int())
    .min(1, { message: 'At least one pageId must be provided when pageIds is supplied.' })
    .optional(),
});

export const createPolicyCheckRequestSchema = z.object({
  importIds: z.array(z.string().uuid()).min(1),
});

export type PolicyCheckRequest = z.infer<typeof policyCheckRequestSchema>;
export type PolicyCheckImport = z.infer<typeof policyCheckImportSchema>;
export type CreatePolicyCheckImport = z.infer<typeof createPolicyCheckImportSchema>;
export type CreatePolicyCheckRequest = z.infer<typeof createPolicyCheckRequestSchema>;
