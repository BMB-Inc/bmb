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

export const createPolicyCheckRequestSchema = z.object({
  clientId: z.number().int(),
  folderId: z.number().int(),
  documentIds: z.array(z.number().int()).min(1),
  pageIds: z
    .array(z.number().int())
    .min(1, { message: 'At least one pageId must be provided when pageIds is supplied.' })
    .optional(),
});

export type PolicyCheckRequest = z.infer<typeof policyCheckRequestSchema>;
export type CreatePolicyCheckRequest = z.infer<typeof createPolicyCheckRequestSchema>;
