import { z } from "zod/v4";

export const glAdditionalCoveragesSchema = z
  .object({
    GL_COVERAGES_ID: z.number().optional().nullable(),
    GCVCD: z.string().optional().nullable(),
    BUILDING: z.number().optional().nullable(),
    COVDED1: z.string().optional().nullable(),
    COVDED1BASIS1: z.string().optional().nullable(),
    COVDED1BASIS2: z.string().optional().nullable(),
    COVDED1TYPE: z.string().optional().nullable(),
    COVDED2: z.string().optional().nullable(),
    COVDED2BASIS1: z.string().optional().nullable(),
    COVDED2BASIS2: z.string().optional().nullable(),
    COVDED2TYPE: z.string().optional().nullable(),
    COVERAGEDESCRIPTION: z.string().optional().nullable(),
    COVLIMIT1: z.number().optional().nullable(),
    COVLIMIT2: z.number().optional().nullable(),
    COVPREMIUM: z.number().optional().nullable(),
    COVRATE: z.number().optional().nullable(),
    EDTDATE: z.date().optional().nullable(),
    FORM: z.string().optional().nullable(),
    HAZARDNO: z.number().optional().nullable(),
    JOBNO: z.string().optional().nullable(),
    LOCATIONNO: z.number().optional().nullable(),
    REMARKSLINE1: z.string().optional().nullable(),
    REMARKSLINE2: z.string().optional().nullable(),
    STATE: z.string().optional().nullable(),
    Z_ASSOC_ROW: z.number().optional().nullable(),
  })
  .meta({
    description:
      "General liability additional coverages from Sagitta table 'GL_COVERAGES_GCVCD'",
    sagittaTable: "GL_COVERAGES_GCVCD",
  });

export type GlAdditionalCoveragesSchema = z.infer<
  typeof glAdditionalCoveragesSchema
>;
