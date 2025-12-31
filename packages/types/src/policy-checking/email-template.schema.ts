import z from 'zod/v4';

export const policyCheckEmailTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  subject: z.string(),
  body: z.string(),
  isActive: z.boolean(),
  createdByUserId: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createPolicyCheckEmailTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().min(1),
  body: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const updatePolicyCheckEmailTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export type PolicyCheckEmailTemplate = z.infer<typeof policyCheckEmailTemplateSchema>;
export type CreatePolicyCheckEmailTemplate = z.infer<typeof createPolicyCheckEmailTemplateSchema>;
export type UpdatePolicyCheckEmailTemplate = z.infer<typeof updatePolicyCheckEmailTemplateSchema>;
