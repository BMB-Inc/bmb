import z from 'zod/v4';

import { imagerightClientSchema } from '../imageright/clients/clients.schema';

export const policyCheckClientCodeSchema = z.object({
  clientId: z.number().int(),
  clientCode: z.string().nullable(),
  client: imagerightClientSchema.nullable(),
});

export type PolicyCheckClientCode = z.infer<typeof policyCheckClientCodeSchema>;
