import z from "zod/v4";
import { miscCoveragesCoverageSchema } from "./misc-coverages-coverage.schema";

export const miscCoveragesSchema = z
  .object({
    OL_COVERAGES_ID: z.number().nullable().optional(),
    COVERAGESEQUENCENUMBER: z.string().nullable().optional(),
    DATEOFF: z.date().nullable().optional(),
    LASTEFFDATE: z.date().nullable().optional(),
    LASTENTRYDATE: z.date().nullable().optional(),
    LASTUSER: z.string().nullable().optional(),
    LINEOFBUSINESS: z.string().nullable().optional(),
    LINEOFBUSINESSCODE: z.string().nullable().optional(),
    POLICIES_ID: z.number().nullable().optional(),
    MISC_COVERAGES_COVERAGE: z
      .array(miscCoveragesCoverageSchema)
      .nullable()
      .optional(),
  })
  .meta({
    description: "Misc Coverages from Sagitta table 'OL_COVERAGES'",
    sagittaTable: "OL_COVERAGES",
  });

export type MiscCoveragesSchema = z.infer<typeof miscCoveragesSchema>;
