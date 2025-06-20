import { z } from "zod/v4";

export const brCoveragesAddCovCodeSchema = z
  .object({
    BR_COVERAGES_ID: z.number().int().nullable().optional(),
    ADDCOVCODE: z.string().nullable().optional(),
    ADDITIONALCOVDESC: z.string().nullable().optional(),
    ADDITIONALCOVRATE: z.number().nullable().optional(),
    ADDLCOVADDLINFO: z.string().nullable().optional(),
    ADDLCOVENDTFORM: z.string().nullable().optional(),
    ADDLCOVENDTFORMDATE: z.date().nullable().optional(),
    ADDLCOVPREMIUM: z.number().nullable().optional(),
    FIRSTADDLCOVDEDUCTDESC: z.string().nullable().optional(),
    FIRSTADDLCOVDEDUCTION: z.number().int().nullable().optional(),
    FIRSTADDLCOVLIMIT: z.number().nullable().optional(),
    SECONDADDLCOVDEDUCTDESC: z.string().nullable().optional(),
    SECONDADDLCOVDEDUCTION: z.number().int().nullable().optional(),
    SECONDADDLCOVLIMIT: z.number().nullable().optional(),
    COVSEQ: z.string().nullable().optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
  })
  .meta({
    description:
      "Builders risk coverages add cov code from Sagitta table 'BR_COVERAGES_ADDCOVCODE'",
    sagittaTable: "BR_COVERAGES_ADDCOVCODE",
  });

export type BrCoveragesAddCovCodeSchema = z.infer<
  typeof brCoveragesAddCovCodeSchema
>;
