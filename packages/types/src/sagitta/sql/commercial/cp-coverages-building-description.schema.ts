import z from "zod/v4";

export const cpCoveragesBuildingDescriptionSchema = z
  .object({
    CP_COVERAGES_ID: z.number(),
    BUILDINGDESCRIPTION: z.string(),
    Z_ASSOC_ROW: z.number(),
  })
  .meta({
    description:
      "Commercial Property Coverages Building Description from Sagitta table 'CP_COVERAGES_BUILDING_DESCRIPTION'",
    sagittaTable: "CP_COVERAGES_BUILDING_DESCRIPTION",
  });

export type CPBuildingDescriptionSchema = z.infer<
  typeof cpCoveragesBuildingDescriptionSchema
>;
