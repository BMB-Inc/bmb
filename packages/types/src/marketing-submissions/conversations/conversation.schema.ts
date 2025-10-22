import z from "zod/v4";
import { MarketingSubmissionsThreadStatus } from "../communications";

const marketingSubmissionsConversationRecipientSchema = z.object({
	emailAddress: z.object({
		name: z.string(),
		address: z.email(),
	})
});

export const marketingSubmissionsConversationSchema = z.object({
	id: z.uuid(),
	submission_id: z.int(),
	conversation_id: z.string(),
	updated_at: z.coerce.date().nullable().optional(),
	created_at: z.coerce.date(),
	carrier_id: z.uuid(),
	status: z.enum(MarketingSubmissionsThreadStatus),
	sentTo: z.array(marketingSubmissionsConversationRecipientSchema),
	lastMessage: z.coerce.date(),
	messageCount: z.int(),
});

export type MarketingSubmissionsConversationSchema = z.infer<
	typeof marketingSubmissionsConversationSchema
>;