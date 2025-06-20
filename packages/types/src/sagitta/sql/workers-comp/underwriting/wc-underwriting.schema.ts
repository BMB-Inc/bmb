import { z } from "zod/v4";

export const wcUnderwritingSchema = z
  .object({
    WC_UNDERWRITING_ID: z.number().nullable().optional(),
    AIRCRAFTWATEREXPOS: z.string().nullable().optional(),
    ANNIVERSARYRATINGDATE: z.date().nullable().optional(),
    ANYEMPLOYEESOVER: z.string().nullable().optional(),
    ANYHANDICAPPEDEMPLOYEES: z.string().nullable().optional(),
    BARGESVESSELSDOCKS: z.string().nullable().optional(),
    BUREAUID: z.string().nullable().optional(),
    CANCELLEDDECLINEDNONRENEW: z.string().nullable().optional(),
    DATEOFF: z.date().nullable().optional(),
    DEPOSITPREM: z.number().nullable().optional(),
    EMPLOYEESTRAVELONBUSINESS: z.string().nullable().optional(),
    EMPLOYEESUNDEROVER: z.string().nullable().optional(),
    EMPLOYERID: z.string().nullable().optional(),
    ESTIMATEDANNUALPREMIUM: z.number().nullable().optional(),
    EXPERIENCEMOD: z.number().nullable().optional(),
    FLAMMABLEEXPLCAUSTICSFUMES: z.string().nullable().optional(),
    FORMALSAFETYPROGRAM: z.string().nullable().optional(),
    GROUPTRANSPORTATIONPROVIDED: z.string().nullable().optional(),
    MERIT: z.string().nullable().optional(),
    MINIMUMPREM: z.number().nullable().optional(),
    MODIFIEDPREMIUM: z.number().nullable().optional(),
    NCCIID: z.string().nullable().optional(),
    OTHERINSURANCEWITHINSURER: z.string().nullable().optional(),
    OTHERTYPESOFBUSINESSES: z.string().nullable().optional(),
    PARTTIME: z.string().nullable().optional(),
    PARTTIMESEASONALWORKER: z.string().nullable().optional(),
    POLICIES_ID: z.number().nullable().optional(),
    RADIOACTIVEMATERIALS: z.string().nullable().optional(),
    RATINGEFFDATE: z.date().nullable().optional(),
    REQUIREPREEMPLOYMENTPHYSICALS: z.string().nullable().optional(),
    RETRO: z.string().nullable().optional(),
    RETROYEAR: z.string().nullable().optional(),
    SPONSOREDATHLETICEVENTS: z.string().nullable().optional(),
    STATE: z.string().nullable().optional(),
    SUBCONTRACTORSUSED: z.string().nullable().optional(),
    SUBCONTWORKWITHOUTCERT: z.string().nullable().optional(),
    TOTALPREMIUM: z.number().nullable().optional(),
    URISEQ: z.string().nullable().optional(),
    USEVOLUNTEERDONATEDLABOR: z.string().nullable().optional(),
    VOLASSIGNEDRISKINDICATOR: z.string().nullable().optional(),
    WORKFROMHOME: z.number().nullable().optional(),
    WORKUNDERGROUNDORABOVE: z.string().nullable().optional(),
  })
  .meta({
    description:
      "Workers compensation underwriting from Sagitta table 'WC_UNDERWRITING'",
    sagittaTable: "WC_UNDERWRITING",
  });

export type WCUnderwritingSchema = z.infer<typeof wcUnderwritingSchema>;
