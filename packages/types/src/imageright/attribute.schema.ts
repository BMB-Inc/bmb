import { z } from "zod/v4";

const attributeValueSchema = z.object({
  description: z.string(),
});

const attributeTypeSchema = z.object({
  description: z.string(),
  oneOf: z.enum(['atInt', 'atBool', 'atString', 'atDate', 'atFloat', 'atBinary', 'atUser', 'atCustom']),
});

// Schema for client attributes
export const imagerightAttributeSchema = z.object({
  displayName: z.string(),
  name: z.string(),
  value: attributeValueSchema,
  attributeType: attributeTypeSchema,
});

export type ImagerightAttribute = z.infer<typeof imagerightAttributeSchema>;