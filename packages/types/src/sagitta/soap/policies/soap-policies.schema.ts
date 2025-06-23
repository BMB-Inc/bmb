import z from "zod/v4";
import { CoverageCode } from "../../sql/policies";

export const producerPolicySoapSchema = z.object({
  Producer1Cd: z.string().nullable().optional(),
  Producer2Cd: z.string().nullable().optional(),
  Producer3Cd: z.string().nullable().optional(),
});

export const soapPoliciesSchema = z.object({
  PolicyNumber: z.string().nullable().optional(),
  NamedInsured: z.string().nullable().optional(),
  BillToCd: z.number().nullable().optional(),
  ClientCd: z.number().nullable().optional(),
  PolicyRemarkText: z.string().nullable().optional(),
  InsurerName: z.number().nullable().optional(),
  CoverageCd: z.number(),
  CoverageCode: z.enum(CoverageCode).nullable().optional(),
  EffectiveDate: z.number(),
  ExpirationDate: z.number(),
  PolicyContractTermCd: z.string().nullable().optional(),
  PolicyEffectiveDt: z.number(),
  PolicyEffectiveLocalStandardTimeInd: z.number().nullable().optional(),
  PolicyExpirationDt: z.number(),
  PolicyExpirationLocalStandardTimeInd: z.number().nullable().optional(),
  PolicyOriginalInceptionDt: z.number().nullable().optional(),
  BillTypeCd: z.string().nullable().optional(),
  NewRenewInd: z.string().nullable().optional(),
  LastTransactionInd: z.string().nullable().optional(),
  LastTransactionDt: z.number().nullable().optional(),
  Producer: producerPolicySoapSchema,
  WrittenPremiumAmt: z.number().nullable().optional(),
  WrittenAgcyCommissionAmt: z.number().nullable().optional(),
  WrittenProducerCommissionAmt: z.number().nullable().optional(),
  PreviousPolicyId: z.number().nullable().optional(),
  AnnualPremiumAmt: z.number().nullable().optional(),
  AnnualAgencyPremiumAmt: z.number().nullable().optional(),
  AnnualProducerPremiumAmt: z.number().nullable().optional(),
  DivisionCd: z.number().nullable().optional(),
  StateProvCd: z.string().nullable().optional(),
  LastLetter: z.string().nullable().optional(),
  ServicerCd: z.string().nullable().optional(),
  DepartmentCd: z.string().nullable().optional(),
  SICCd: z.number().nullable().optional(),
  PayeeCd: z.string().nullable().optional(),
  PolicyDesc: z.string().nullable().optional(),
  PolicyId: z.string().nullable().optional(),
  "@_sagitem": z.number(),
});

export type SoapPoliciesSchema = z.infer<typeof soapPoliciesSchema>;
