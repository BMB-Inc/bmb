import z from 'zod/v4';

export const sendBindingEmailSchema = z.object({
  bound_submission_quote_id: z.string().uuid({
    message: 'A valid submission quote id is required to send a binding email.',
  }),
  line_of_business: z.string().trim().min(1).optional(),
  minimum_earned_premium: z
    .coerce.number({ message: 'Minimum earned premium must be a valid number when provided.' })
    .nonnegative({ message: 'Minimum earned premium must be zero or a positive number.' })
    .refine(
      (value) => Number.isInteger(value),
      'Minimum earned premium must be a whole number when provided.',
    )
    .optional(),
  bmb_commission_pct: z
    .coerce.number({ message: 'BMB commission percent must be a valid number when provided.' })
    .nonnegative({ message: 'BMB commission percent must be zero or a positive number.' })
    .optional(),
  producer_commission: z
    .coerce.number({ message: 'Producer commission must be a valid number when provided.' })
    .nonnegative({ message: 'Producer commission must be zero or a positive number.' })
    .optional(),
  ae_commission: z
    .coerce.number({ message: 'AE commission must be a valid number when provided.' })
    .nonnegative({ message: 'AE commission must be zero or a positive number.' })
    .optional(),
  fee: z
    .coerce.number({ message: 'Fee must be a valid number when provided.' })
    .nonnegative({ message: 'Fee must be zero or a positive number.' })
    .refine((value) => Number.isInteger(value), 'Fee must be a whole number when provided.')
    .optional(),
  assessments: z
    .coerce.number({ message: 'Assessments must be a valid number when provided.' })
    .nonnegative({ message: 'Assessments must be zero or a positive number.' })
    .optional(),
  surplus_tax_type: z.string().trim().min(1).optional(),
  surplus_lines: z.boolean().optional(),
  surplus_lines_tax: z
    .coerce.number({ message: 'Surplus lines tax must be a valid number when provided.' })
    .nonnegative({ message: 'Surplus lines tax must be zero or a positive number.' })
    .optional(),
  stamp_fee: z
    .coerce.number({ message: 'Stamp fee must be a valid number when provided.' })
    .nonnegative({ message: 'Stamp fee must be zero or a positive number.' })
    .optional(),
  taxes: z
    .coerce.number({ message: 'Taxes must be a valid number when provided.' })
    .nonnegative({ message: 'Taxes must be zero or a positive number.' })
    .optional(),
  fees: z
    .coerce.number({ message: 'Fees must be a valid number when provided.' })
    .nonnegative({ message: 'Fees must be zero or a positive number.' })
    .optional(),
  premium: z.coerce
    .number({ message: 'Premium is required to send a binding email.' })
    .nonnegative({ message: 'Premium must be zero or a positive number.' }),
  body: z.string({ message: 'Binding email body is required.' }).trim().min(1, {
    message: 'Binding email body cannot be empty.',
  }),
});

export type SendBindingEmailDto = z.infer<typeof sendBindingEmailSchema>;
