import { z } from "zod/v4";

export const brUnderwritingAddlinfoSchema = z
  .object({
    BR_UNDERWRITING_ADDLINFO_ID: z.number().int().nullable().optional(),
    COMPLETED_VALUE: z.number().int().nullable().optional(),
    CONSTRUCTION: z.string().nullable().optional(),
    DISTANCE_TO_OPERATING_FIRE_HYDRANT: z.number().int().nullable().optional(),
    ESTIMATED_TIME_TO_COMPLETE_PROJECT: z.string().nullable().optional(),
    FIRE_DEPT: z.string().nullable().optional(),
    IF_YES_ARE_PILINGS_USED: z.string().nullable().optional(),
    IF_YES_AT_WHAT_PERCENTAGE_OF_COMPLETION: z
      .number()
      .int()
      .nullable()
      .optional(),
    IS_CONSTRUCTION_LIFT_SLAB: z.string().nullable().optional(),
    IS_CONSTRUCTION_PROTOTYPE: z.string().nullable().optional(),
    IS_CONSTRUCTION_TILT_UP: z.string().nullable().optional(),
    IS_PROJECT_ON_FILLED_LAND: z.string().nullable().optional(),
    NUMBER_OF_FIREWALLS: z.number().int().nullable().optional(),
    NUMBER_OF_FLOORS_ABOVE_GROUND: z.number().int().nullable().optional(),
    NUMBER_OF_FLOORS_BELOW_GROUND: z.number().int().nullable().optional(),
    NUMBER_OF_STRUCTURES: z.number().int().nullable().optional(),
    POLICIES_ID: z.number().int().nullable().optional(),
    PUBLIC_FIRE_PROTECTION_CLASS_AT_JOBSITE: z.string().nullable().optional(),
    RATING_NUMBER_OF_HOURS: z.number().int().nullable().optional(),
    ROOF_TYPE: z.string().nullable().optional(),
    SPRINKLERS_BE_ACTIVATED_DURING_CONST: z.string().nullable().optional(),
    SUPPORT_FRAMING_STUDS: z.string().nullable().optional(),
    TOTAL_SQUARE_FOOTAGE: z.number().int().nullable().optional(),
    TYPE_OF_PROJECT: z.string().nullable().optional(),
    WATCHMAN_ON_PREMISES_DURING_NONWORK_HRS: z.string().nullable().optional(),
    WHEN_DOORS_INSTALLED_PERCENTAGE: z.number().int().nullable().optional(),
    WHEN_INSTALLED_PERCENTAGE: z.number().int().nullable().optional(),
    WILL_THE_PROJECT_BE_FENCED: z.string().nullable().optional(),
    WILL_THE_PROJECT_BE_LIGHTED: z.string().nullable().optional(),
    WILL_THE_PROJECT_BE_LOCKED: z.string().nullable().optional(),
  })
  .meta({
    description:
      "Builders risk underwriting addl info from Sagitta table 'BR_UNDERWRITING_ADDLINFO'",
    sagittaTable: "BR_UNDERWRITING_ADDLINFO",
  });
export type BrUnderwritingAddlinfoSchema = z.infer<
  typeof brUnderwritingAddlinfoSchema
>;
