import { z } from "zod/v4";

export const baCoveragesNonOwnClassSchema = z
  .object({
    BA_COVERAGES_ID: z.number().nullable().optional(),
    NONOWNCLASS: z.string().nullable().optional(),
    NONOWNEMPL: z.string().nullable().optional(),
    NONOWNGRP: z.string().nullable().optional(),
    NONOWNINDLIAB: z.string().nullable().optional(),
    NONOWNLOCSEQ: z.number().nullable().optional(),
    NONOWNPCT: z.string().nullable().optional(),
    NONOWNSOCSERV: z.string().nullable().optional(),
    NONOWNSTATE: z.string().nullable().optional(),
    BACOVSEQ: z.string().nullable().optional(),
    Z_ASSOC_ROW: z.number().nullable().optional(),
  })
  .meta({
    description:
      "Auto coverages non own class from Sagitta table 'BA_COVERAGES_NONOWNCLASS'",
    sagittaTable: "BA_COVERAGES_NONOWNCLASS",
  });

export type BACoveragesNonOwnClassSchema = z.infer<
  typeof baCoveragesNonOwnClassSchema
>;
