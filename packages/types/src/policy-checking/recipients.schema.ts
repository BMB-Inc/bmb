import z from 'zod/v4';

export const policyCheckRecipientSchema = z.string().email();

export const policyCheckRecipientsSchema = z.array(policyCheckRecipientSchema);

export const policyCheckRecipientListSchema = z.object({
  recipients: policyCheckRecipientsSchema,
});

export type PolicyCheckRecipient = z.infer<typeof policyCheckRecipientSchema>;
export type PolicyCheckRecipients = z.infer<typeof policyCheckRecipientsSchema>;
export type PolicyCheckRecipientList = z.infer<typeof policyCheckRecipientListSchema>;
