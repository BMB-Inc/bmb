import { z } from "zod/v4";

export const brUnderwritingSchema = z
  .object({
    BR_UNDERWRITING_ID: z.number().nullable().optional(),
    AMOUNTSHIPPED: z.number().nullable().optional(),
    ANNUALNO: z.string().nullable().optional(),
    AVERAGECOSTPERINSTALL: z.number().nullable().optional(),
    AVERAGECOSTVALUE: z.number().nullable().optional(),
    AVERAGENOINPROGRESS: z.string().nullable().optional(),
    COMMENCEMENTDATE: z.date().nullable().optional(),
    COMMONCARRIER: z.string().nullable().optional(),
    COMPLETED_VALUE_ADDL: z.number().nullable().optional(),
    COMPLETIONDATE: z.date().nullable().optional(),
    CONSTRUCTION_ADDL: z.string().nullable().optional(),
    CONTRACTAMOUNT: z.number().nullable().optional(),
    DATEOFF: z.date().nullable().optional(),
    DISTANCEINVOLVED: z.string().nullable().optional(),
    DISTANCE_TO_OPERATING_FIRE_HYDRANT_ADDL: z.number().nullable().optional(),
    ESTIMATED_TIME_TO_COMPLETE_PROJECT_ADDL: z.string().nullable().optional(),
    FIRE_DEPT_ADDL: z.string().nullable().optional(),
    IF_YES_ARE_PILINGS_USED_ADDL: z.string().nullable().optional(),
    IF_YES_AT_WHAT_PERCENTAGE_OF_COMPLETION_ADDL: z
      .number()
      .nullable()
      .optional(),
    INSUREDSJOBNO: z.string().nullable().optional(),
    INSUREDVEHICLES: z.string().nullable().optional(),
    IS_CONSTRUCTION_LIFT_SLAB_ADDL: z.string().nullable().optional(),
    IS_CONSTRUCTION_PROTOTYPE_ADDL: z.string().nullable().optional(),
    IS_CONSTRUCTION_TILT_UP_ADDL: z.string().nullable().optional(),
    IS_PROJECT_ON_FILLED_LAND_ADDL: z.string().nullable().optional(),
    JOBDESCRIPTION: z.string().nullable().optional(),
    JOBLENGTH: z.string().nullable().optional(),
    LASTEFFDATE: z.date().nullable().optional(),
    LASTENTRYDATE: z.date().nullable().optional(),
    LASTUSER: z.string().nullable().optional(),
    MATERIALCOST: z.string().nullable().optional(),
    MATERIALCOSTPERCENT: z.string().nullable().optional(),
    MAXCOSTVALUE: z.number().nullable().optional(),
    MAXIMUMCOSTPERINSTALL: z.number().nullable().optional(),
    MAXIMUMNOINPROGRESS: z.string().nullable().optional(),
    MINIMUMCOSTPERINSTALL: z.number().nullable().optional(),
    MINIMUMCOSTVALUE: z.number().nullable().optional(),
    NEXTMONTHS: z.number().nullable().optional(),
    NUMBER_OF_FIREWALLS_ADDL: z.number().nullable().optional(),
    NUMBER_OF_FLOORS_ABOVE_GROUND_ADDL: z.number().nullable().optional(),
    NUMBER_OF_FLOORS_BELOW_GROUND_ADDL: z.number().nullable().optional(),
    NUMBER_OF_STRUCTURES_ADDL: z.number().nullable().optional(),
    OPERATINGTERRITORY: z.string().nullable().optional(),
    PASTMONTHS: z.number().nullable().optional(),
    POLICIES_ID: z.number().nullable().optional(),
    PUBLIC_FIRE_PROTECTION_CLASS_AT_JOBSITE_ADDL: z
      .string()
      .nullable()
      .optional(),
    RATING_NUMBER_OF_HOURS_ADDL: z.number().nullable().optional(),
    REMARKS: z.string().nullable().optional(),
    REMARKSLINES: z.string().nullable().optional(),
    RESIDANN: z.string().nullable().optional(),
    RESIDAVG: z.string().nullable().optional(),
    RESIDLENGTH: z.string().nullable().optional(),
    RESIDMAX: z.string().nullable().optional(),
    RIGGINGDESCRIPTION: z.string().nullable().optional(),
    ROOF_TYPE_ADDL: z.string().nullable().optional(),
    SECURITYDESCRIPTION: z.string().nullable().optional(),
    SPRINKLERS_BE_ACTIVATED_DURING_CONST_ADDL: z.string().nullable().optional(),
    SUPPORT_FRAMING_STUDS_ADDL: z.string().nullable().optional(),
    TOTAL_SQUARE_FOOTAGE_ADDL: z.number().nullable().optional(),
    TRANSPORTATIONPERCENTAGE: z.string().nullable().optional(),
    TYPE_OF_PROJECT_ADDL: z.string().nullable().optional(),
    URISEQ: z.string().nullable().optional(),
    VALUEOWNERSUPPLIEDPROP: z.number().nullable().optional(),
    WATCHMAN_ON_PREMISES_DURING_NONWORK_HRS_ADDL: z
      .string()
      .nullable()
      .optional(),
    WHEN_DOORS_INSTALLED_PERCENTAGE_ADDL: z.number().nullable().optional(),
    WHEN_INSTALLED_PERCENTAGE_ADDL: z.number().nullable().optional(),
    WILL_THE_PROJECT_BE_FENCED_ADDL: z.string().nullable().optional(),
    WILL_THE_PROJECT_BE_LIGHTED_ADDL: z.string().nullable().optional(),
    WILL_THE_PROJECT_BE_LOCKED_ADDL: z.string().nullable().optional(),
  })
  .meta({
    description:
      "Builders risk underwriting from Sagitta table 'BR_UNDERWRITING'",
    sagittaTable: "BR_UNDERWRITING",
  });

export type BrUnderwritingSchema = z.infer<typeof brUnderwritingSchema>;
