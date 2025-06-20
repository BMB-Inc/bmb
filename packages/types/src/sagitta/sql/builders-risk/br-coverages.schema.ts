import { z } from "zod/v4";

export const brCoveragesSchema = z
  .object({
    BR_COVERAGES_ID: z.number().int().nullable().optional(),
    BLDRSRISK: z.string().nullable().optional(),
    COMPLETEDVALUE: z.string().nullable().optional(),
    COVSEQ: z.string().nullable().optional(),
    DATEOFF: z.date().nullable().optional(),
    FIRSTOPENRPTINGONELOCLMT: z.number().nullable().optional(),
    FIRSTOPENRPTINGONELOCTEXT: z.string().nullable().optional(),
    INSTALLATION: z.string().nullable().optional(),
    JOBSPECIFIC: z.string().nullable().optional(),
    JOBSPECIFICLOCLMT: z.number().nullable().optional(),
    JOBSPECIFICMAXPAID: z.number().nullable().optional(),
    JOBSPECIFICTEMPLIMIT: z.number().nullable().optional(),
    JOBSPECIFICTRANSITLMT: z.number().nullable().optional(),
    LASTEFFDATE: z.date().nullable().optional(),
    LASTENTRYDATE: z.date().nullable().optional(),
    LASTUSER: z.string().nullable().optional(),
    OPENREPORTING: z.string().nullable().optional(),
    OPENRPTINGPERDISASTERLIMIT: z.number().nullable().optional(),
    OPENRPTINGTEMPLOCLMT: z.number().nullable().optional(),
    OPENRPTINGTRANSITLMT: z.number().nullable().optional(),
    POLICIES_ID: z.number().int().nullable().optional(),
    REPORTINGADJPER: z.string().nullable().optional(),
    REPORTINGANNPREM: z.number().nullable().optional(),
    REPORTINGDEPPREM: z.number().nullable().optional(),
    RPTINGPERIOD: z.string().nullable().optional(),
    SECONDOPENRPTINGONELOCLMT: z.number().nullable().optional(),
    SECONDOPENRPTINGONELOCTEXT: z.string().nullable().optional(),
  })
  .meta({
    description: "Builders risk coverages from Sagitta table 'BR_COVERAGES'",
    sagittaTable: "BR_COVERAGES",
  });

export type BrCoveragesSchema = z.infer<typeof brCoveragesSchema>;
