export interface MyDeskOverviewSummary {
  totalSubmissions: number;
  actionableItems: number;
}

export interface AwaitingReplyOverviewItem {
  submissionId: number;
  clientName: string;
  carrierName: string;
  threadId: string;
  lastInboundAt: Date;
  daysSince: number;
  subject: string;
}

export interface BindingStatusOverviewItem {
  submissionId: number;
  clientName: string;
  carrierName: string;
  threadId: string;
  lastActivityAt: Date;
  daysSince: number;
}

export interface IncompleteSubjectivitiesOverviewItem {
  submissionId: number;
  clientName: string;
  carrierName: string;
  threadId: string;
  boundAt: Date;
  daysSinceBound: number;
  incompleteCount: number;
}

export interface ReadyToSendOverviewItem {
  submissionId: number;
  clientName: string;
  accountType: string | null;
  createdAt: Date;
  daysSinceCreated: number;
}

export interface StaleThreadOverviewItem {
  submissionId: number;
  clientName: string;
  carrierName: string;
  threadId: string;
  lastActivityAt: Date;
  daysSince: number;
  subject: string;
}

export interface MyDeskOverview {
  summary: MyDeskOverviewSummary;
  awaitingReply: AwaitingReplyOverviewItem[];
  needsBindingStatus: BindingStatusOverviewItem[];
  incompleteSubjectivities: IncompleteSubjectivitiesOverviewItem[];
  readyToSend: ReadyToSendOverviewItem[];
  staleThreads: StaleThreadOverviewItem[];
}

