import z from 'zod/v4';

export enum MarketingSubmissionsBindingStatus {
  DECLINED = 'DECLINED',
  BOUND = 'BOUND',
  CLOSED = 'CLOSED',
  QUOTED = 'QUOTED',
}

const bindingStatusValues: [
  MarketingSubmissionsBindingStatus,
  ...MarketingSubmissionsBindingStatus[],
] = [
  MarketingSubmissionsBindingStatus.DECLINED,
  MarketingSubmissionsBindingStatus.BOUND,
  MarketingSubmissionsBindingStatus.CLOSED,
  MarketingSubmissionsBindingStatus.QUOTED,
];

const bindingStatusEnum = z.enum(bindingStatusValues);
const lineOfBusinessSchema = z.string().trim().min(1);
const surplusTaxTypeSchema = z.string().trim().min(1);

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

export const marketingSubmissionsBindThreadSchema = z.object({
  id: z.uuid(),
  thread_id: z.uuid(),
  status: bindingStatusEnum,
  premium: z.number().int().nonnegative().nullable().optional(),
  taxes: z.number().int().nonnegative().nullable().optional(),
  fees: z.number().int().nonnegative().nullable().optional(),
  bill: z.number().int().nonnegative().nullable().optional(),
  line_of_business: lineOfBusinessSchema.nullable(),
  bound_submission_quote_id: z.string().uuid().nullable().optional(),
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
    line_of_business: lineOfBusinessSchema.nullable().optional(),
    surplus_tax_type: surplusTaxTypeSchema.nullable().optional(),
    surplus_lines: z.boolean().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.status === MarketingSubmissionsBindingStatus.BOUND ||
      data.status === MarketingSubmissionsBindingStatus.QUOTED
    ) {
      if (typeof data.premium !== 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['premium'],
          message: 'Premium is required when binding or quoting a submission.',
        });
      }
    }

    if (data.status === MarketingSubmissionsBindingStatus.BOUND) {
      if (typeof data.bound_submission_quote_id !== 'string') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bound_submission_quote_id'],
          message: 'Bound status requires a submission quote id.',
        });
      }
    }

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
 * Schema for contact options in bound quote data responses
 */
export const boundQuoteContactOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  lob: z.array(z.string()),
});

export type BoundQuoteContactOptionSchema = z.infer<typeof boundQuoteContactOptionSchema>;

/**
 * Schema for bound quote data response
 * Extends bind thread schema with carrier and contact information
 */
export const boundQuoteDataResponseSchema = marketingSubmissionsBindThreadSchema
  .pick({
    premium: true,
    taxes: true,
    fees: true,
    bill: true,
    line_of_business: true,
    bound_submission_quote_id: true,
    minimum_earned_premium: true,
    bmb_commission_pct: true,
    producer_commission: true,
    ae_commission: true,
    assessments: true,
    surplus_tax_type: true,
    is_renewal: true,
    primary_contact_id: true,
  })
  .extend({
    // Alias for line_of_business
    coverage: z.string().nullable(),
    // Carrier information
    insurer: z.string().nullable(),
    carrier: z.string().nullable(),
    carrier_id: z.string().uuid().nullable(),
    // Contact information
    contact_name: z.string().nullable(),
    contact_email: z.string().nullable(),
    contact_id: z.string().uuid().nullable(),
    all_contacts: z.array(boundQuoteContactOptionSchema),
    // Alias for minimum_earned_premium
    mep: z.number().nullable().optional(),
    // Alias for surplus_tax_type
    surplus_lines_type: z.string().nullable(),
  });

export type BoundQuoteDataResponseSchema = z.infer<typeof boundQuoteDataResponseSchema>;
