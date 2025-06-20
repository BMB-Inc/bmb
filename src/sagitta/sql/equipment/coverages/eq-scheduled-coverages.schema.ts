import { z } from "zod/v4";

export const eqScheduledCoveragesSchema = z
  .object({
    EQ_COVERAGES_ID: z.number().optional(),
    COVSEQ: z.string().optional(),
    EQUIP_SCHED: z.string().optional(),
    ADDLOTHERINTERESTSEQ: z.number().optional(),
    EQUIPMENTDATEOFF: z.date().optional(),
    EQUIPMENTSCHMODELYEAR: z.coerce
      .number()
      .min(1, { message: "Model year is required." })
      .transform((val) => val.toString())
      .optional(),
    EQUIPSCHAMOUNTOFINSURANCE: z.coerce
      .number()
      .min(1, { message: "Amount of Insurance is required." })
      .optional(),
    EQUIPSCHDESCRIPTION: z
      .string()
      .min(1, { message: "Description is required." })
      .optional(),
    EQUIPSCHEDDEDAMT: z.number().optional(),
    EQUIPSCHIDDEDBASIS: z.string().optional(),
    EQUIPSCHIDDEDTYPE: z.string().optional(),
    EQUIPSCHIDITEMVALUE: z.number().optional(),
    EQUIPSCHIDLIMBAS: z.string().optional(),
    EQUIPSCHIDMANUF: z.string().optional(),
    EQUIPSCHIDMODEL: z
      .string()
      .min(1, { message: "Model is required." })
      .optional(),
    EQUIPSCHIDOWNEDLEASED: z.string().optional(),
    EQUIPSCHIDSERIAL: z
      .string()
      .min(1, { message: "Serial number is required." })
      .optional(),
    EQUIPSCHIDVALDATE: z.date().optional(),
    EQUIPSCHIDVALTYPE: z.string().optional(),
    EQUIPSCHNEWUSEDFLAG: z.string().optional(),
    EQUIPSCHPURCHASEDDATE: z.date().optional(),
    Z_ASSOC_ROW: z.number().optional(),
  })
  .meta({
    description:
      "Equipment scheduled coverages from Sagitta table 'EQ_COVERAGES_EQUIP_SCHED'",
    sagittaTable: "EQ_COVERAGES_EQUIP_SCHED",
  });

export type EQScheduledCoveragesSchema = z.infer<
  typeof eqScheduledCoveragesSchema
>;
