import z from "zod/v4";

export const locationsSchema = z
  .object({
    LOCATIONS_ID: z.number().optional().nullable(),
    CITYCODE: z.string().optional().nullable(),
    CITYLIMITSCODE: z.string().optional().nullable(),
    CITYLIMITSDESC: z.string().optional().nullable(),
    COUNTYTOWNCODE: z.string().optional().nullable(),
    DATEOFF: z.date().optional().nullable(),
    LASTEFFDATE: z.date().optional().nullable(),
    LASTENTRYDATE: z.date().optional().nullable(),
    LASTUSER: z.string().optional().nullable(),
    LOCATION: z.string().optional().nullable(),
    LOCATIONADDRESS: z.string().optional().nullable(),
    LOCATIONCITY: z.string().optional().nullable(),
    LOCATIONCOUNTY: z.string().optional().nullable(),
    LOCSEQ: z.string().optional().nullable(),
    POLICIES_ID: z.number().optional().nullable(),
    RATETERR: z.string().optional().nullable(),
    STATE: z.string().optional().nullable(),
    TAXCODE: z.string().optional().nullable(),
    ZIPCODE: z.string().optional().nullable(),
    ZIPCODEEXT: z.string().optional().nullable(),
  })
  .meta({
    description: "Locations from Sagitta table 'LOCATIONS'",
    sagittaTable: "LOCATIONS",
  });

export type LocationsSchema = z.infer<typeof locationsSchema>;
