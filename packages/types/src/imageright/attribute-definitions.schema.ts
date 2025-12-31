import { z } from "zod/v4";

import { attributeTypeSchema, attributeValueSchema } from "./attribute.schema";

export const imagerightAttributeDefinitionSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional().nullable(),
  attributeType: attributeTypeSchema,
  defaultValue: attributeValueSchema.optional().nullable(),
});

export const imagerightAttributeDefinitionsSchema = z.array(imagerightAttributeDefinitionSchema);

export type ImagerightAttributeDefinition = z.infer<typeof imagerightAttributeDefinitionSchema>;
export type ImagerightAttributeDefinitions = z.infer<typeof imagerightAttributeDefinitionsSchema>;
