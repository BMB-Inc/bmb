import { z } from "zod/v4";

export const statusEnum = {
  'Out to Market': 'Out to Market',
  Incomplete: 'Incomplete',
  Inquiry: 'Inquiry',
  'Not Bound': 'Not Bound',
  Quoted: 'Quoted',
  Bound: 'Bound',
  Written: 'Written',
  'Not Written': 'Not Written',
  'Not Quoted': 'Not Quoted',
} as const;


export const submissionsSchema = z.object({
  submission_id: z.uuid().meta({
    description: "The generated UUID of the submission.",
  }),
  status: z.enum(statusEnum).meta({
    description: "The status of the submission.",
  }),
  date_received: z.coerce.date().meta({
    description: "The date the submission was received.",
  }),
  effective_date: z.coerce.date().meta({
    description: "The date the policy is effective if written.",
  }),
  expiration_date: z.coerce.date().meta({
    description: "The date the policy expires if written.",
  }),
  client_code: z.string().meta({
    description: "The Sagitta client code of the submitted account.",
  }),
  named_insured: z.string().meta({
    description: "The named insured of the submitted account.",
  }),
  state: z.string().meta({
    description: "The state (location) of the submitted account.",
  }),
  agent: z.string().meta({
    description:
      "The agent who is associated with the submission. i.e. Bowen, Miclette, & Britt, etc.",
  }),
  marketer: z.string().meta({
    description: "UUID of the staff member who created the submission.",
  }),
  producer: z.string().meta({
    description: "UUID of the producer who is associated with the submission.",
  }),
  type_of_risk: z.array(z.string()).meta({
    description:
      "The type of risk of the submitted account. Should be an enum, but need more data to determine the exact values.",
  }),
  premium: z.number().meta({
    description: "The premium of the submitted account.",
  }).optional().nullable(),
  account_notes: z.string().meta({
    description:
      "Freeform text field for any additional notes about the submission.",
  }).optional().nullable(),
  expiring_premium: z.number().meta({
    description: "The expiring premium of the submitted account.",
  }).optional().nullable(),

});

export const createSubmissionSchema = submissionsSchema.omit({
  submission_id: true,
});

export const updateSubmissionSchema = createSubmissionSchema.partial();

export type MerrimacMarketingSubmission = z.infer<typeof submissionsSchema>;
export type MerrimacMarketingCreateSubmission = z.infer<
  typeof createSubmissionSchema
>;
export type MerrimacMarketingUpdateSubmission = z.infer<
  typeof updateSubmissionSchema
>;
