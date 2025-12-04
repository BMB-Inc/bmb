import type { MarketingSubmissionsQuoteSchema } from './submission-quote.schema';

export type MarketingSubmissionsQuoteResponse = MarketingSubmissionsQuoteSchema & {
  file_name: string;
  file_type: string;
  file_size: number;
  file_deleted: boolean;
  contact_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
};
