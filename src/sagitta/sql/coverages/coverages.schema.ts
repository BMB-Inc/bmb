import z from "zod/v4";

export const coveragesSchema = z
  .object({
    COVERAGES_ID: z.number(),
    ACORD_LOB_CODE: z.string().nullable().optional(),
    ACORD_SUB_LOB: z.string().nullable().optional(),
    CLIENT_CODE: z.string().nullable().optional(),
    COVERAGE_CODE: z.string().nullable().optional(),
    COVERAGE_DESCRIPTION: z.string().nullable().optional(),
    COVERAGE_TYPE: z.string().nullable().optional(),
    COVID: z.number().nullable().optional(),
    DATE_OFF: z.string().nullable().optional(),
    MAJOR_LOB_CODE: z.string().nullable().optional(),
    PERSONAL_COMMERCIAL: z.string().nullable().optional(),
  })
  .meta({
    description: "Coverages from Sagitta table 'COVERAGES'",
    sagittaTable: "COVERAGES",
  });

export type CoveragesSchema = z.infer<typeof coveragesSchema>;
