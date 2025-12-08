import z from 'zod/v4';

const marketingSubmissionsConversationRecipientSchema = z.object({
  emailAddress: z.object({
    name: z.string(),
    address: z.email(),
  }),
});

export const marketingSubmissionsConversationSchema = z.object({
  id: z.uuid(),
  submission_id: z.number().int(),
  conversation_id: z.string(),
  updated_at: z.coerce.date().nullable().optional(),
  created_at: z.coerce.date(),
  carrier_id: z.uuid(),
  sentTo: z.array(marketingSubmissionsConversationRecipientSchema),
  lastMessage: z.coerce.date(),
  messageCount: z.number().int(),
});

export type MarketingSubmissionsConversationSchema = z.infer<
  typeof marketingSubmissionsConversationSchema
>;
