import type { SubmissionInboxResponse } from "../communications";

export type MarketingSubmissionsEmailResponse = SubmissionInboxResponse & {
	messageId: string;
	submissionId: number;
};