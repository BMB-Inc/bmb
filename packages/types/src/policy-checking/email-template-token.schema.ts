import z from 'zod/v4';

export const policyCheckEmailTemplateTokenSchema = z.object({
  key: z.string(),
  token: z.string(),
  description: z.string(),
});

export const policyCheckEmailTemplateTokensSchema = z.array(policyCheckEmailTemplateTokenSchema);

export type PolicyCheckEmailTemplateToken = z.infer<typeof policyCheckEmailTemplateTokenSchema>;
export type PolicyCheckEmailTemplateTokens = z.infer<typeof policyCheckEmailTemplateTokensSchema>;
