import { MarketingSubmissionsEmailDirection } from '../communications/email.schema';

export interface MyDeskOverviewSummary {
  totalSubmissions: number;
  actionableItems: number;
}

export interface ThreadEmailMetadata {
  to: string[];
  cc: string[] | null;
  bcc: string[] | null;
  from: string | null;
  direction: MarketingSubmissionsEmailDirection;
  internetMessageId: string | null;
}

export interface AwaitingReplyOverviewItem {
  submissionId: number;
  clientName: string;
  expDate: Date;
  daysUntilExpiration: number;
  carrierName: string;
  threadId: string;
  conversationId: string;
  lastInboundAt: Date;
  daysSince: number;
  subject: string;
  lastMessageMetadata: ThreadEmailMetadata;
}

export interface WaitingOnCarrierOverviewItem {
  submissionId: number;
  clientName: string;
  expDate: Date;
  daysUntilExpiration: number;
  carrierName: string;
  threadId: string;
  conversationId: string;
  lastOutboundAt: Date;
  daysSince: number;
  subject: string;
  lastMessageMetadata: ThreadEmailMetadata;
}

export interface BindingStatusOverviewItem {
  submissionId: number;
  clientName: string;
  expDate: Date;
  daysUntilExpiration: number;
  carrierName: string;
  threadId: string;
  conversationId: string;
  lastActivityAt: Date;
  daysSince: number;
  lastMessageMetadata: ThreadEmailMetadata;
}

export interface IncompleteSubjectivitiesOverviewItem {
  submissionId: number;
  clientName: string;
  expDate: Date;
  daysUntilExpiration: number;
  carrierName: string;
  threadId: string;
  conversationId: string;
  boundAt: Date;
  daysSinceBound: number;
  incompleteCount: number;
  lastMessageMetadata: ThreadEmailMetadata;
}

export interface ReadyToSendOverviewItem {
  submissionId: number;
  clientName: string;
  accountType: string | null;
  expDate: Date;
  daysUntilExpiration: number;
  createdAt: Date;
  daysSinceCreated: number;
}

export interface StaleThreadOverviewItem {
  submissionId: number;
  clientName: string;
  expDate: Date;
  daysUntilExpiration: number;
  carrierName: string;
  threadId: string;
  conversationId: string;
  lastActivityAt: Date;
  daysSince: number;
  subject: string;
  lastMessageMetadata: ThreadEmailMetadata;
}

export interface MyDeskOverview {
  summary: MyDeskOverviewSummary;
  awaitingReply: AwaitingReplyOverviewItem[];
  waitingOnCarrier: WaitingOnCarrierOverviewItem[];
  needsBindingStatus: BindingStatusOverviewItem[];
  incompleteSubjectivities: IncompleteSubjectivitiesOverviewItem[];
  readyToSend: ReadyToSendOverviewItem[];
  staleThreads: StaleThreadOverviewItem[];
  hasIncompleteEmailHistory?: boolean;
}
