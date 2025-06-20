import { z } from "zod/v4";

export const baCoveragesHiredClassSchema = z
  .object({
    BA_COVERAGES_ID: z.number().nullable().optional(),
    HIREDCLASS: z.string().nullable().optional(),
    DAYSHIRED: z.string().nullable().optional(),
    HIREDCOLL: z.number().nullable().optional(),
    HIREDCOMP: z.number().nullable().optional(),
    HIREDCOST: z.number().nullable().optional(),
    HIREDLIABRATE: z.number().nullable().optional(),
    HIREDLOCSEQ: z.number().nullable().optional(),
    HIREDPDLIMIT: z.string().nullable().optional(),
    HIREDPDRATE: z.number().nullable().optional(),
    HIREDPDUNLIMITED: z.string().nullable().optional(),
    HIREDSPEC: z.number().nullable().optional(),
    HIREDSTATE: z.string().nullable().optional(),
    MINIMUMPREMIUM: z.string().nullable().optional(),
    VEHICLES: z.string().nullable().optional(),
    BACOVSEQ: z.string().nullable().optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
  })
  .meta({
    description:
      "Auto coverages hired class from Sagitta table 'BA_COVERAGES_HIREDCLASS'",
    sagittaTable: "BA_COVERAGES_HIREDCLASS",
  });

export type BACoveragesHiredClassSchema = z.infer<
  typeof baCoveragesHiredClassSchema
>;
