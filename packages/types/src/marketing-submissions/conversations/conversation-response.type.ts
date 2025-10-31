import { MarketingSubmissionsConversationSchema } from "./conversation.schema";

export type MarketingSubmissionsConversationResponse = MarketingSubmissionsConversationSchema & { carrier_name: string, lob: string[], subject: string | null }