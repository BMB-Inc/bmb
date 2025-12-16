import z from 'zod/v4';

export enum PolicyCheckEmailDirection {
  OUTBOUND = 'outbound',
  INBOUND = 'inbound',
}

const emailDirectionValues: [PolicyCheckEmailDirection, ...PolicyCheckEmailDirection[]] = [
  PolicyCheckEmailDirection.OUTBOUND,
  PolicyCheckEmailDirection.INBOUND,
];

export const policyCheckEmailSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  graph_message_id: z.string().nullable(),
  internet_message_id: z.string().nullable(),
  conversation_id: z.string().nullable(),
  direction: z.enum(emailDirectionValues),
  subject: z.string(),
  body: z.string().nullable(),
  sent_at: z.coerce.date().nullable(),
  received_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
});

export const sendPolicyCheckEmailResultSchema = z.object({
  emailId: z.string(),
  graphMessageId: z.string().nullable(),
  internetMessageId: z.string().nullable(),
  conversationId: z.string().nullable(),
});

export type PolicyCheckEmail = z.infer<typeof policyCheckEmailSchema>;
export type SendPolicyCheckEmailResult = z.infer<typeof sendPolicyCheckEmailResultSchema>;
