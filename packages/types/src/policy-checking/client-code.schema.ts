import z from 'zod/v4';

export const policyCheckClientCodeSchema = z.object({
  clientId: z.number().int(),
  clientCode: z.string().nullable(),
});

export type PolicyCheckClientCode = z.infer<typeof policyCheckClientCodeSchema>;
