import { z } from 'zod/v4';

export enum DocumentTypes {
  prodCorr = 'prodCorr',
  misc = 'misc',
  financials = 'financials',
  riskMgt = 'riskMgt',
  contractAgreement = 'contractAgreement',
  contractReview = 'contractReview',
  cert = 'cert',
  certCorr = 'certCorr',
  financeAgreement = 'financeAgreement',
  lossRuns = 'lossRuns',
  quote = 'quote',
  marketTrans = 'marketTrans',
  submit = 'submit',
  apps = 'apps',
  applications = 'applications', // Alias for apps
  confirm = 'confirm',
  proposal = 'proposal',
  renWs = 'renWs',
  proposalFinal = 'proposalFinal',
  bindingInfo = 'bindingInfo',
  cab = 'cab',
  policy = 'policy',
  canc = 'canc',
  nonRenewal = 'nonRenewal',
  endt = 'endt',
  expMod = 'expMod',
  reportingForm = 'reportingForm',
  noticeOfLoss = 'noticeOfLoss',
  corr = 'corr',
  carrierNoticesPayment = 'carrierNoticesPayment',
  estimates = 'estimates',
  legalDocs = 'legalDocs',
  claimsReview = 'claimsReview',
  newMail = 'newMail',
}

export const getDocumentsDto = z.object({
  clientId: z.coerce.number(),
  folderId: z.coerce.number().optional().nullable(),
  description: z.string().optional().nullable(),
  documentType: z.enum(DocumentTypes).optional().nullable(),
  documentTypes: z.enum(DocumentTypes).array().optional(),
});

export type GetDocumentsDto = z.infer<typeof getDocumentsDto>;
