import { MarketingSubmissionsConversationSchema } from './conversation.schema';

export type MarketingSubmissionsConversationResponse = MarketingSubmissionsConversationSchema & {
  carrier_name: string;
  lob: string[];
  subject: string | null;
  binding_status: string | null;
  cell_phone: string | null;
  work_phone: string | null;
};
