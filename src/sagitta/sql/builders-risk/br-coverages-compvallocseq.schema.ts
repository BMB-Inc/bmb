import { z } from "zod/v4";

export const brCoveragesCompValLocSeqSchema = z
  .object({
    BR_COVERAGES_ID: z.number().int().nullable(),
    COMPVALLOCSEQ: z.number().int().nullable(),
    COMPLETEDVALUESITELMT: z.number().nullable(),
    COMPLETEDVALUESUB: z.string().nullable(),
    COVSEQ: z.string().nullable(),
    Z_ASSOC_ROW: z.number().int().nullable(),
  })
  .meta({
    description:
      "Builders risk coverages comp val loc seq from Sagitta table 'BR_COVERAGES_COMPVALLOCSEQ'",
    sagittaTable: "BR_COVERAGES_COMPVALLOCSEQ",
  });

export type BrCoveragesCompValLocSeqSchema = z.infer<
  typeof brCoveragesCompValLocSeqSchema
>;
