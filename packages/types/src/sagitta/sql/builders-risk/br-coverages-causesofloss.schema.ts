import { z } from "zod/v4";

export const brCoveragesCausesOfLossSchema = z
  .object({
    BR_COVERAGES_ID: z.number().int().nullable().optional(),
    CAUSESOFLOSS: z.string().nullable().optional(),
    CAUSEOFLOSSDEDUCTIBLE: z.number().int().nullable().optional(),
    CAUSEOFLOSSSUBLIMIT: z.number().nullable().optional(),
    COVSEQ: z.string().nullable().optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
  })
  .meta({
    description:
      "Builders risk coverages causes of loss from Sagitta table 'BR_COVERAGES_CAUSESOFLOSS'",
    sagittaTable: "BR_COVERAGES_CAUSESOFLOSS",
  });

export type BrCoveragesCausesOfLossSchema = z.infer<
  typeof brCoveragesCausesOfLossSchema
>;
