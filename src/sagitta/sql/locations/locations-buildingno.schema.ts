import z from "zod/v4";

export const locationsBuildingnoSchema = z
  .object({
    LOCATIONS_ID: z.number(),
    BUILDINGNO: z.string().optional().nullable(),
    BLDNGSUBLOCDESC: z.string().optional().nullable(),
    LOCSEQ: z.string().optional().nullable(),
    Z_ASSOC_ROW: z.number().optional().nullable(),
  })
  .meta({
    description:
      "Locations Building No from Sagitta table 'LOCATIONS_BUILDINGNO'",
    sagittaTable: "LOCATIONS_BUILDINGNO",
  });

export type LocationsBuildingnoSchema = z.infer<
  typeof locationsBuildingnoSchema
>;
