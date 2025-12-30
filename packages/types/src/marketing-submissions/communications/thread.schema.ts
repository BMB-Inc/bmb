import z from 'zod/v4';

export enum MarketingSubmissionsBindingStatus {
  DECLINED = 'DECLINED',
  BOUND = 'BOUND',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  QUOTED = 'QUOTED',
}

const bindingStatusValues: [
  MarketingSubmissionsBindingStatus,
  ...MarketingSubmissionsBindingStatus[],
] = [
  MarketingSubmissionsBindingStatus.DECLINED,
  MarketingSubmissionsBindingStatus.BOUND,
  MarketingSubmissionsBindingStatus.ACTIVE,
  MarketingSubmissionsBindingStatus.CLOSED,
  MarketingSubmissionsBindingStatus.QUOTED,
];

const bindingStatusEnum = z.enum(bindingStatusValues);
const lineOfBusinessSchema = z.string().trim().min(1);
const bindingDateSchema = z.coerce.date();
const policyNumberSchema = z.string().trim().min(1);
export enum SurplusTaxEnum {
  BMB = 'BMB',
  BKR = 'BKR',
}
const surplusTaxTypeSchema = z.enum(SurplusTaxEnum);

export const marketingSubmissionsThreadSchema = z.object({
  id: z.uuid(),
  carrier_id: z.uuid(),
  created_at: z.coerce.date(),
  submission_id: z.number().int(),
  conversation_id: z.string(),
  updated_at: z.coerce.date().nullable().optional(),
});

export const createMarketingSubmissionsThreadSchema = marketingSubmissionsThreadSchema.omit({
  id: true,
  created_at: true,
});

export const updateMarketingSubmissionsThreadSchema =
  createMarketingSubmissionsThreadSchema.partial();

export type MarketingSubmissionsThreadSchema = z.infer<typeof marketingSubmissionsThreadSchema>;
export type CreateMarketingSubmissionsThreadSchema = z.infer<
  typeof createMarketingSubmissionsThreadSchema
>;
export type UpdateMarketingSubmissionsThreadSchema = z.infer<
  typeof updateMarketingSubmissionsThreadSchema
>;

export enum MarketingSubmissionsBillType {
  DIRECT = 'DIRECT',
  AGENCY = 'AGENCY',
}

const billTypeValues: [MarketingSubmissionsBillType, ...MarketingSubmissionsBillType[]] = [
  MarketingSubmissionsBillType.DIRECT,
  MarketingSubmissionsBillType.AGENCY,
];

const billTypeEnum = z.enum(billTypeValues);

export const marketingSubmissionsBindThreadSchema = z.object({
  id: z.uuid(),
  quote_id: z.string().uuid(),
  thread_id: z.string().uuid().nullable().optional(),
  status: bindingStatusEnum,
  premium: z.number().int().nonnegative().nullable().optional(),
  taxes: z.number().int().nonnegative().nullable().optional(),
  fees: z.number().int().nonnegative().nullable().optional(),
  bill: billTypeEnum.nullable().optional(),
  line_of_business: lineOfBusinessSchema.nullable(),
  declination_reason: z.string().trim().nullable().optional(),
  minimum_earned_premium: z.number().int().nonnegative().nullable().optional(),
  bmb_commission_pct: z.number().nonnegative().nullable().optional(),
  producer_commission: z.number().nonnegative().nullable().optional(),
  ae_commission: z.number().nonnegative().nullable().optional(),
  assessments: z.number().nonnegative().nullable().optional(),
  surplus_tax_type: surplusTaxTypeSchema.nullable(),
  surplus_lines: z.boolean().nullable(),
  surplus_lines_tax: z.number().nonnegative().nullable().optional(),
  stamp_fee: z.number().nonnegative().nullable().optional(),
  is_renewal: z.boolean().nullable().optional(),
  primary_contact_id: z.string().uuid().nullable().optional(),
  exp_date: bindingDateSchema.nullable(),
  eff_date: bindingDateSchema.nullable(),
  policy_number: policyNumberSchema.nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const marketingSubmissionsBindThreadDto = marketingSubmissionsBindThreadSchema
  .omit({
    id: true,
    thread_id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    quote_id: z.string().uuid().optional(),
    line_of_business: lineOfBusinessSchema.nullable().optional(),
    surplus_tax_type: surplusTaxTypeSchema.nullable().optional(),
    surplus_lines: z.boolean().nullable().optional(),
    exp_date: bindingDateSchema.nullable().optional(),
    eff_date: bindingDateSchema.nullable().optional(),
    policy_number: policyNumberSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === MarketingSubmissionsBindingStatus.DECLINED) {
      if (typeof data.declination_reason !== 'string' || data.declination_reason.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['declination_reason'],
          message: 'Declining a submission requires a declination reason.',
        });
      }
    }
  });

export type MarketingSubmissionsBindThreadSchema = z.infer<
  typeof marketingSubmissionsBindThreadSchema
>;
export type MarketingSubmissionsBindThreadDto = z.infer<typeof marketingSubmissionsBindThreadDto>;

/**
 * Schema for the submission-level bound quote data response
 * Surfaces the persisted thread binding statuses for every thread in the submission
 */
export const boundQuoteDataResponseSchema = z.array(marketingSubmissionsBindThreadSchema);

export type BoundQuoteDataResponseSchema = z.infer<typeof boundQuoteDataResponseSchema>;
