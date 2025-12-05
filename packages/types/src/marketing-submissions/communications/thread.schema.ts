import z from 'zod/v4';

export enum MarketingSubmissionsThreadStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
  QUOTED = 'QUOTED',
}

export enum MarketingSubmissionsBindingStatus {
  DECLINED = 'DECLINED',
  BOUND = 'BOUND',
  CLOSED = 'CLOSED',
  QUOTED = 'QUOTED',
}

const threadStatusValues: [
  MarketingSubmissionsThreadStatus,
  ...MarketingSubmissionsThreadStatus[],
] = [
  MarketingSubmissionsThreadStatus.ACTIVE,
  MarketingSubmissionsThreadStatus.CLOSED,
  MarketingSubmissionsThreadStatus.ARCHIVED,
  MarketingSubmissionsThreadStatus.QUOTED,
];

const bindingStatusValues: [
  MarketingSubmissionsBindingStatus,
  ...MarketingSubmissionsBindingStatus[],
] = [
  MarketingSubmissionsBindingStatus.DECLINED,
  MarketingSubmissionsBindingStatus.BOUND,
  MarketingSubmissionsBindingStatus.CLOSED,
  MarketingSubmissionsBindingStatus.QUOTED,
];

const threadStatusEnum = z.enum(threadStatusValues);
const bindingStatusEnum = z.enum(bindingStatusValues);
const lineOfBusinessArraySchema = z.array(z.string().trim().min(1)).nonempty();

export const marketingSubmissionsThreadSchema = z.object({
  id: z.uuid(),
  carrier_id: z.uuid(),
  status: threadStatusEnum,
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
  line_of_business: lineOfBusinessArraySchema.nullable(),
  bound_submission_quote_id: z.string().uuid().nullable().optional(),
  declination_reason: z.string().trim().nullable().optional(),
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
    line_of_business: lineOfBusinessArraySchema.nullable().optional(),
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
