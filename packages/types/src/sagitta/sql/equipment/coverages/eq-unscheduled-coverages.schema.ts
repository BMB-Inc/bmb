import { z } from "zod/v4";

export const eqUnscheduledCoveragesSchema = z
  .object({
    EQ_COVERAGES_ID: z.number().optional(),
    COVSEQ: z.string().optional(),
    UNSCHEQDESC: z.string().optional(),
    UNSCHEDULEDEQUIPAMTINSURANCE: z.number().optional(),
    UNSCHEDULEDEQUIPMAXITEMS: z
      .number()
      .optional()
      .transform((val) => val?.toString()),
    UNSCHEQUIPCOINPERCENT: z.number().optional(),
  })
  .meta({
    description:
      "Equipment unscheduled coverages from Sagitta table 'EQ_COVERAGES_UNSCHEQDESC'",
    sagittaTable: "EQ_COVERAGES_UNSCHEQDESC",
  });

export type EQUnscheduledCoveragesSchema = z.infer<
  typeof eqUnscheduledCoveragesSchema
>;
