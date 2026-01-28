import { z } from "zod/v4";

export const imagerightDrawerSchema = z.object({
  Id: z.number(),
  DrawerTypeId: z.number(),
  ParentId: z.number(),
  Name: z.string(),
  Description: z.string(),
  Created: z.string(),
  LastModified: z.string(),
  EffectivePermissions: z.number(),
});

export const imagerightDrawersSchema = z.array(imagerightDrawerSchema);

export type ImagerightDrawer = z.infer<typeof imagerightDrawerSchema>;
export type ImagerightDrawers = z.infer<typeof imagerightDrawersSchema>;
