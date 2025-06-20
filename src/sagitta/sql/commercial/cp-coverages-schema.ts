import z from "zod/v4";
import { cpCoveragesBuildingNoSchema } from "./cp-coverages-buildingno.schema";

export const cpCoveragesSchema = z
  .object({
    CP_COVERAGES_ID: z.number().optional().nullable(),
    DATEOFF: z.date().optional().nullable(),
    LASTEFFDATE: z.date().optional().nullable(),
    LASTENTRYDATE: z.date().optional().nullable(),
    LASTUSER: z.string().optional().nullable(),
    LOCATIONS_ID: z.number().optional().nullable(),
    LOCNO: z.string().optional().nullable(),
    OPTCOVSUBLOC: z.string().optional().nullable(),
    POLICIES_ID: z.number().optional().nullable(),
    CP_COVERAGES_BUILDINGNO: z.array(cpCoveragesBuildingNoSchema).optional(),
    LOCATIONADDRESS: z.string().optional().nullable(),
  })
  .meta({
    description:
      "Commercial Property Coverages from Sagitta table 'CP_COVERAGES'",
    sagittaTable: "CP_COVERAGES",
  });

export type CPCoveragesSchema = z.infer<typeof cpCoveragesSchema>;
