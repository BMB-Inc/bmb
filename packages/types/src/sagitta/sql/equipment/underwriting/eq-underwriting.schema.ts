import { z } from "zod/v4";

export const eqUnderwritingSchema = z
  .object({
    EQ_UNDERWRITING_ID: z.number().nullable().optional(),
    ANYWORKDONEAFLOAT: z.string().nullable().optional(),
    APPEQUIPNOTLISTED: z.string().nullable().optional(),
    EQUIPRENTEDLOANEDTOFROMOTHERS: z.string().nullable().optional(),
    LASTEFFDATE: z.date().nullable().optional(),
    LASTENTRYDATE: z.date().nullable().optional(),
    LASTUSER: z.string().nullable().optional(),
    POLICIES_ID: z.number().nullable().optional(),
    PROPERTYUSEDUNDERGROUND: z.string().nullable().optional(),
    RECOBTAINEDIMPOSINGFULLRES: z.string().nullable().optional(),
    URISEQ: z.string().nullable().optional(),
  })
  .meta({
    description: "Equipment underwriting from Sagitta table 'EQ_UNDERWRITING'",
    sagittaTable: "EQ_UNDERWRITING",
  });

export type EQUnderwritingSchema = z.infer<typeof eqUnderwritingSchema>;
